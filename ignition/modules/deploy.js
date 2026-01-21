import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BeggingModule", (m) => {
  const begging = m.contract("Begging");

  m.call(begging, "donation");

  return {begging};
});