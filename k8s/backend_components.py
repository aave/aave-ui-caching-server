import values

from kdsl.core.v1 import ObjectMeta
from kdsl.core.v1 import Service, PodSpec, ObjectMeta, ContainerItem
from kdsl.apps.v1 import Deployment
from kdsl.extra import mk_env
from kdsl.recipe import overlay, collection
from typing import Sequence, Optional

custom_variables = overlay(
    mainnet=dict(
        NETWORK="mainnet",
        BLOCK_NUMBER_POOLING_INTERVAL="1",
        PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES="0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5,0xacc030ef66f9dfeae9cbb0cd1b25654b82cfa8d5",
        PROTOCOLS_WITH_INCENTIVES_ADDRESSES="0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        POOL_UI_DATA_PROVIDER_ADDRESS="0x47e300dDd1d25447482E2F7e5a5a967EA2DA8634",
        AAVE_TOKEN_ADDRESS="0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        ABPT_TOKEN="0x41A08648C3766F9F9d85598fF102a08f4ef84F84",
        STK_AAVE_TOKEN_ADDRESS="0x4da27a545c0c5B758a6BA100e3a049001de870f5",
        STK_ABPT_TOKEN_ADDRESS="0xa1116930326D21fB917d5A27F1E9943A9595fb47",
        STAKE_DATA_PROVIDER="0xc57450af527d10Fe182521AB39C1AD23c1e1BaDE",
        STAKE_DATA_POOLING_INTERVAL="1",
        RPC_URL=values.MAINNET_RPC,
        UI_INCENTIVE_DATA_PROVIDER_ADDRESS="0xd9F1e5F70B14b8Fd577Df84be7D75afB8a3A0186",
        CHAINLINK_FEED_QUOTE="eth",
        CHAINLINK_FEEDS_REGISTRY="0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf",
        GENERAL_RESERVES_DATA_POOLING_INTERVAL="4",
        USERS_DATA_POOLING_INTERVAL="4",
        RESERVE_INCENTIVES_DATA_POOLING_INTERVAL='4',
        USER_INCENTIVES_DATA_POOLING_INTERVAL='4',
    ),
    polygon=dict(
        NETWORK="polygon",
        BLOCK_NUMBER_POOLING_INTERVAL="5",
        PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES="0xd05e3E715d945B59290df0ae8eF85c1BdB684744",
        PROTOCOLS_WITH_INCENTIVES_ADDRESSES="0xd05e3E715d945B59290df0ae8eF85c1BdB684744",
        POOL_UI_DATA_PROVIDER_ADDRESS="0x538C84EA84F655f2e04eBfAD4948abA9495A2Fc3",
        RPC_URL=values.POLYGON_RPC,
        UI_INCENTIVE_DATA_PROVIDER_ADDRESS="0xC5093EDAC52f4DD68b42433eA8754B26eAbb1A48",
        GENERAL_RESERVES_DATA_POOLING_INTERVAL="2",
        USERS_DATA_POOLING_INTERVAL="2",
        RESERVE_INCENTIVES_DATA_POOLING_INTERVAL='2',
        USER_INCENTIVES_DATA_POOLING_INTERVAL='2',
    ),
    avalanche=dict(
        NETWORK="avalanche",
        BLOCK_NUMBER_POOLING_INTERVAL="5",
        PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES="0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f",
        PROTOCOLS_WITH_INCENTIVES_ADDRESSES="0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f",
        POOL_UI_DATA_PROVIDER_ADDRESS="0xf51F46EfE8eFA7BB6AA8cDfb1d2eFb8eb27d12c5",
        RPC_URL="https://api.avax.network/ext/bc/C/rpc",
        UI_INCENTIVE_DATA_PROVIDER_ADDRESS='0x16Dea0fCBca21E848714B2e96f26ddF6BCe505C9',
        GENERAL_RESERVES_DATA_POOLING_INTERVAL="1",
        USERS_DATA_POOLING_INTERVAL="1",
        RESERVE_INCENTIVES_DATA_POOLING_INTERVAL='1',
        USER_INCENTIVES_DATA_POOLING_INTERVAL='1',
    ),
)

env = mk_env(
    REDIS_HOST="redis",
    RPC_MAX_TIMEOUT="5",
    **custom_variables,
)


def mk_backend_entries(name: str, command: Sequence[str], port: Optional[int] = None, scale: int = 1):
    labels = dict(component=name)

    metadata = ObjectMeta(
        name=name,
        namespace=values.NAMESPACE,
        labels=labels,
    )

    if port is not None:
        service = Service(
            metadata=metadata,
            spec=dict(
                selector=labels,
                ports={
                    port: dict(name="http"),
                },
            ),
        )
        service_list = [service]
        container_ports_mixin = dict(
            ports={
                port: dict(name="http", protocol="TCP"),
            }
        )
    else:
        service_list = []
        container_ports_mixin = dict()

    pod_spec = PodSpec(
        containers=dict(
            main=ContainerItem(
                image=values.IMAGE,
                imagePullPolicy="Always",
                **container_ports_mixin,
                command=command,
                env=env,
            ),
        ),
    )

    deployment = Deployment(
        metadata=metadata,
        spec=dict(
            replicas=scale,
            selector=dict(matchLabels=labels),
            progressDeadlineSeconds=180,
            strategy=dict(
                type="RollingUpdate",
                rollingUpdate=dict(
                    maxUnavailable=0,
                    maxSurge=1,
                ),
            ),
            template=dict(
                metadata=ObjectMeta(labels=labels),
                spec=pod_spec,
            ),
        ),
    )

    return [*service_list, deployment]


entries = collection(
    base=[
        *mk_backend_entries(
            name="api",
            command=["npm", "run", "prod"],
            port=3000,
            scale=4
        ),
        *mk_backend_entries(
            name="protocol-data-loader",
            command=["npm", "run", "job:update-general-reserves-data"],
        ),
        *mk_backend_entries(
            name="user-data-loader",
            command=["npm", "run", "job:update-users-data"],
        ),
        *mk_backend_entries(
            name="update-block-number-loader",
            command=["npm", "run", "job:update-block-number"],
        ),
    ],
    mainnet=[
        *mk_backend_entries(
            name="stake-general-data-loader",
            command=["npm", "run", "job:update-stake-general-ui-data"],
        ),
        *mk_backend_entries(
            name="stake-user-data-loader",
            command=["npm", "run", "job:update-stake-user-ui-data"],
        ),
    ],
)
