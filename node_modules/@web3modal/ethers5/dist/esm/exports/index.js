import { Web3Modal } from '../src/client.js';
import { ConstantsUtil } from '@web3modal/utils';
export { defaultConfig } from '../src/utils/defaultConfig.js';
export function createWeb3Modal(options) {
    return new Web3Modal({ ...options, _sdkVersion: `html-ethers5-${ConstantsUtil.VERSION}` });
}
//# sourceMappingURL=index.js.map