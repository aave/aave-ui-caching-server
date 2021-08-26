import { AaveCustomProvider } from './aave-custom-provider';
import { AaveProviderContext } from './models/aave-provider-context';
import { InternalAaveProviderContext } from './models/internal-aave-provider-context';

export const generate: (context: AaveProviderContext) => AaveCustomProvider = (
  context: AaveProviderContext
) => {
  return new AaveCustomProvider(context, internalGenerate);
};

const internalGenerate: (context: InternalAaveProviderContext) => AaveCustomProvider = (
  context: AaveProviderContext
) => {
  return new AaveCustomProvider(context, internalGenerate);
};
