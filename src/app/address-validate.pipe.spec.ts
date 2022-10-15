import { AddressValidatePipe } from './address-validate.pipe';

describe('AddressValidatePipe', () => {
  it('create an instance', () => {
    const pipe = new AddressValidatePipe();
    expect(pipe).toBeTruthy();
  });
});
