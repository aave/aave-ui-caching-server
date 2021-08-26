import { POOL_UI_DATA_PROVIDER_ADDRESS } from '../../config';
import { IUiPoolDataProviderFactory } from '../../contracts/ethers/IUiPoolDataProviderFactory';
import { ethereumProvider } from '../../helpers/ethereum';

export default IUiPoolDataProviderFactory.connect(POOL_UI_DATA_PROVIDER_ADDRESS, ethereumProvider);
