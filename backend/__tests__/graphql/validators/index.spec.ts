import { validateSync } from 'class-validator';
import { IsEthAddress } from '../../../src/graphql/validators';
import { poolAddress } from '../../mocks';

class Test {
  @IsEthAddress()
  poolAddress: string;
}

xdescribe('Validators', () => {
  describe('IsEthAddress', () => {
    it('should register errors as ethereum address is incorrect', () => {
      const test = new Test();
      test.poolAddress = 'sdfsda';
      const errors = validateSync(test);
      expect(errors.length).toEqual(1);
    });

    it('should validate successfully with no errors', () => {
      const test = new Test();
      test.poolAddress = poolAddress;
      const errors = validateSync(test);
      expect(errors.length).toEqual(0);
    });

    it('should validate successfully with no errors', () => {
      const test = new Test();
      test.poolAddress = '0x' + poolAddress.substring(2).toUpperCase();
      const errors = validateSync(test);
      expect(errors.length).toEqual(0);
    });

    it('should validate successfully with no errors', () => {
      const test = new Test();
      test.poolAddress = poolAddress.toLowerCase();
      const errors = validateSync(test);
      expect(errors.length).toEqual(0);
    });
  });
});
