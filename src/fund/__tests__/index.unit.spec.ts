import { u128, VMContext } from "near-sdk-as";
import * as util from "../../utils";
import * as contract from "../assembly";
import { payer_index, payee_index, payer_records, payee_records } from "../assembly/models";

const REGISTRY_OWNER_ACCOUNT_ID = "rita";
const FUND_OWNER_ACCOUNT_ID = "danny";
const PAYER_ACCOUNT_ID = "kingsly";
const PAYEE_ACCOUNT_ID = "lissa";
const RECIPIENT_ACCOUNT_ID = "fran";
const FIVE_NEAR = util.toYocto(5);
const SIX_NEAR = util.toYocto(6);
const TEN_NEAR = util.toYocto(10);

function initializeContract(): void {
  VMContext.setPredecessor_account_id(REGISTRY_OWNER_ACCOUNT_ID);
  VMContext.setSigner_account_id(FUND_OWNER_ACCOUNT_ID);
  VMContext.setAttached_deposit(TEN_NEAR);
  contract.init();
}

function setUnrestrictedBalance(): void {
  contract.set_unrestricted_balance(FIVE_NEAR);
} 

function createPayers(): void {
  contract.create_payers([PAYER_ACCOUNT_ID], FIVE_NEAR);
}

function setPayerBalance(): void {
  contract.set_payer_balance(PAYER_ACCOUNT_ID, TEN_NEAR);
}

function deletePayers(): void {
  contract.delete_payers([PAYER_ACCOUNT_ID]);
}

function createPayees(): void {
  contract.create_payees([PAYEE_ACCOUNT_ID], FIVE_NEAR);
}

function setPayeeBalance(): void {
  contract.set_payee_balance(PAYEE_ACCOUNT_ID, TEN_NEAR);
}

function deletePayees(): void {
  contract.delete_payees([PAYEE_ACCOUNT_ID]);
}

describe("Fund", () => {
  describe("init", () => {
    it("prevents double initialization", () => {
      initializeContract()
      expect(initializeContract).toThrow("Contract is already initialized.");
    })

    it("requires a minimum balance", () => {
      VMContext.setPredecessor_account_id(REGISTRY_OWNER_ACCOUNT_ID);
      VMContext.setSigner_account_id(FUND_OWNER_ACCOUNT_ID);
      expect(() => { contract.init() }).toThrow("Minimum account balance must be attached to initialize this contract (3 NEAR)")
    });
  });

  describe("fund", () => {
    beforeEach(initializeContract);

    it("serves fund record", () => {
      const fund = contract.get_fund();
      expect(fund.owner).toBe(FUND_OWNER_ACCOUNT_ID);
    })

    describe("authorized", () => {
      it("sets the unrestricted balance", () => {
        VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
        setUnrestrictedBalance()
        expect(contract.get_fund().unrestricted_balance).toBe(FIVE_NEAR)
      })
    })

    describe("unauthorized", () => {
      it("throws when non-owner attempts to set unrestricted balance", () => {
        VMContext.setPredecessor_account_id(PAYER_ACCOUNT_ID);
        expect(setUnrestrictedBalance).toThrow("Unauthorized");
      })
    })
  })

  describe("payers", () => {
    beforeEach(initializeContract);

    describe("authorized", () => {
      beforeEach(() => {
        VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
        createPayers()
      })

      it("indexes added payer accounts payer accounts", () => {
        expect(payer_index.has(PAYER_ACCOUNT_ID));
      })
  
      it("serves the payer record", () => {
        expect(payer_records.getSome(PAYER_ACCOUNT_ID).balance).toBe(FIVE_NEAR)
      })
  
      it("serves the payer_index", () => {
        expect(contract.get_payer_index()).toStrictEqual([PAYER_ACCOUNT_ID]);
      })

      it("sets the payer balance", () => {
        setPayerBalance();
        const payer = contract.get_payer(PAYER_ACCOUNT_ID);
        expect(payer.balance).toBe(TEN_NEAR);
      })

      it("deletes the payer", () => {
        deletePayers();
        expect(payer_index.values()).toHaveLength(0);
      })
    })

    describe("unauthorized", () => {
      it("throws an error when non-owner attempts to create payers", () => {
        expect(createPayers).toThrow("Unauthorized");
      })

      it("throws an error when non-owner attempts to set payer balance", () => {
        VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
        createPayers();
        VMContext.setPredecessor_account_id(PAYER_ACCOUNT_ID);
        expect(setPayerBalance).toThrow("Unauthorized");
      })

      it("throws an error when non-owner attempts to delete payer", () => {
        VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
        createPayers();
        VMContext.setPredecessor_account_id(PAYER_ACCOUNT_ID);
        expect(deletePayers).toThrow("Unauthorized");
      })
    })
  })

  describe("payees", () => {
    beforeEach(initializeContract);

    describe("authorized", () => {
      beforeEach(() => {
        VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
        createPayees()
      })

      it("indexes added payee accounts payee accounts", () => {
        expect(payee_index.has(PAYEE_ACCOUNT_ID));
      })
  
      it("serves the payee record", () => {
        expect(payee_records.getSome(PAYEE_ACCOUNT_ID).balance).toBe(FIVE_NEAR)
      })
  
      it("serves the payee_index", () => {
        expect(contract.get_payee_index()).toStrictEqual([PAYEE_ACCOUNT_ID]);
      })

      it("sets the payee balance", () => {
        setPayeeBalance();
        const payee = contract.get_payee(PAYEE_ACCOUNT_ID);
        expect(payee.balance).toBe(TEN_NEAR);
      })

      it("deletes the payee", () => {
        deletePayees();
        expect(payee_index.values()).toHaveLength(0);
      })
    })

    describe("unauthorized", () => {
      it("throws an error when non-owner attempts to create payees", () => {
        expect(createPayees).toThrow("Unauthorized");
      })

      it("throws an error when non-owner attempts to set payee balance", () => {
        VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
        createPayees();
        VMContext.setPredecessor_account_id(PAYEE_ACCOUNT_ID);
        expect(setPayeeBalance).toThrow("Unauthorized");
      })

      it("throws an error when non-owner attempts to delete payee", () => {
        VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
        createPayees();
        VMContext.setPredecessor_account_id(PAYEE_ACCOUNT_ID);
        expect(deletePayees).toThrow("Unauthorized");
      })
    })
  })

  describe("transfer", () => {
    beforeEach(() => {
      initializeContract();
      VMContext.setPredecessor_account_id(FUND_OWNER_ACCOUNT_ID);
      createPayers();
      createPayees();
    });

    describe("authorized", () => {
      describe("sufficient funds", () => {
        beforeEach(() => {
          setUnrestrictedBalance();
          VMContext.setPredecessor_account_id(PAYER_ACCOUNT_ID);
        });

        it("deducts the transfer amount from the payer's balance", () => {
          contract.transfer(RECIPIENT_ACCOUNT_ID, FIVE_NEAR);
          expect(contract.get_payer(PAYER_ACCOUNT_ID).balance).toStrictEqual(u128.Zero);
        })

        it("deducts the transfer amount from the unrestricted balance if recipient is not payee", () => {
          contract.transfer(RECIPIENT_ACCOUNT_ID, FIVE_NEAR);
          expect(contract.get_fund().unrestricted_balance).toStrictEqual(u128.Zero);
        })

        it("deducts the transfer amount from the payee's balance", () => {
          contract.transfer(PAYEE_ACCOUNT_ID, FIVE_NEAR);
          expect(contract.get_payee(PAYEE_ACCOUNT_ID).balance).toStrictEqual(u128.Zero);
        })
      })

      describe("insufficient funds", () => {
        it("throws if transfer amount is more than payer balance", () => {
          contract.set_payee_balance(PAYEE_ACCOUNT_ID, TEN_NEAR);
          VMContext.setPredecessor_account_id(PAYER_ACCOUNT_ID);
          const transfer = (): void => { contract.transfer(PAYEE_ACCOUNT_ID, SIX_NEAR) };
          expect(transfer).toThrow("Insufficient funds");
        })

        it("throws if transfer amount is more than payee balance", () => {
          contract.set_payer_balance(PAYER_ACCOUNT_ID, TEN_NEAR);
          VMContext.setPredecessor_account_id(PAYER_ACCOUNT_ID);
          const transfer = (): void => { contract.transfer(PAYEE_ACCOUNT_ID, SIX_NEAR) };
          expect(transfer).toThrow("Insufficient funds");
        })

        it("throws if recipient is not payee and transfer amount is more than unrestricted balance", () => {
          contract.set_payer_balance(PAYER_ACCOUNT_ID, TEN_NEAR);
          setUnrestrictedBalance();
          VMContext.setPredecessor_account_id(PAYER_ACCOUNT_ID);
          const transfer = (): void => { contract.transfer(RECIPIENT_ACCOUNT_ID, SIX_NEAR) };
          expect(transfer).toThrow("Insufficient funds");
        })
      })
    })

    describe("unauthorized", () => {
      it("throws if non-payer attempts to transfer money", () => {
        expect(() => { contract.transfer(PAYEE_ACCOUNT_ID, FIVE_NEAR) }).toThrow("Unauthorized");
      })
    })
  })
})
