import { VMContext, PersistentMap } from "near-sdk-as";
import * as util from "../../utils";
import * as contract from "../assembly";
import { fundsByOwner } from '../assembly/models';

const FUND_OWNER_ACCOUNT_ID = "danny";
const FUND_SUBACCOUNT = 'myfund';

function initializeContract(): void {
  VMContext.setAttached_deposit(util.MIN_ACCOUNT_BALANCE);
  contract.init();
}

/**
 * == UNIT TESTS ==============================================================
 */
describe('Fund Registry', () => {
  describe('init', () => {
    it('prevents double initialization', () => {
      initializeContract()
      expect(initializeContract).toThrow("Contract is already initialized.");
    })

    it("requires a minimum balance", () => {
      expect(() => { contract.init() }).toThrow("Minimum account balance must be attached to initialize this contract (3 NEAR)")
    });
  });

  describe('view methods', () => {
    beforeEach(initializeContract);

    describe('get_registry', () => {
      it('returns an object with owner', () => {
        const registry = contract.get_registry();
        expect(registry.created_at).toBeTruthy();
      })
    })

    describe('get_fund_index', () => {
      it("returns the index of funds for a user", () => {
        fundsByOwner.set(FUND_OWNER_ACCOUNT_ID, [FUND_SUBACCOUNT]);
        const fund_index = contract.get_fund_index(FUND_OWNER_ACCOUNT_ID);
        expect(fund_index).toStrictEqual([FUND_SUBACCOUNT]);
      })
    })
  })
})
