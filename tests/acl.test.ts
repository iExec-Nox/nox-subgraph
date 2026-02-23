import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { Allowed } from "../generated/schema"
import { Allowed as AllowedEvent } from "../generated/ACL/ACL"
import { handleAllowed } from "../src/acl"
import { createAllowedEvent } from "./acl-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let account = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let handle = Bytes.fromI32(1234567890)
    let newAllowedEvent = createAllowedEvent(sender, account, handle)
    handleAllowed(newAllowedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("Allowed created and stored", () => {
    assert.entityCount("Allowed", 1);
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let account = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let handle = Bytes.fromI32(1234567890);
    let testEvent = createAllowedEvent(sender, account, handle);
    // Build the ID the same way the handler does: transaction.hash.concatI32(logIndex.toI32())
    let entityId = testEvent.transaction.hash.concatI32(testEvent.logIndex.toI32())
    let entityIdHex = entityId.toHexString()

    assert.fieldEquals(
      "Allowed",
      entityIdHex,
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Allowed",
      entityIdHex,
      "account",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Allowed",
      entityIdHex,
      "handle",
      handle.toHexString()
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
