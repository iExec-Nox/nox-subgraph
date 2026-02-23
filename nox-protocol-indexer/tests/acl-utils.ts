import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  Allowed,
  Initialized,
  MarkedAsPubliclyDecryptable,
  NoxComputeUpdated,
  OwnershipTransferred,
  Upgraded,
  ViewerAdded
} from "../generated/ACL/ACL"

export function createAllowedEvent(
  sender: Address,
  account: Address,
  handle: Bytes
): Allowed {
  let allowedEvent = changetype<Allowed>(newMockEvent())

  allowedEvent.parameters = new Array()

  allowedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  allowedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  allowedEvent.parameters.push(
    new ethereum.EventParam("handle", ethereum.Value.fromFixedBytes(handle))
  )

  return allowedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createMarkedAsPubliclyDecryptableEvent(
  sender: Address,
  handle: Bytes
): MarkedAsPubliclyDecryptable {
  let markedAsPubliclyDecryptableEvent =
    changetype<MarkedAsPubliclyDecryptable>(newMockEvent())

  markedAsPubliclyDecryptableEvent.parameters = new Array()

  markedAsPubliclyDecryptableEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  markedAsPubliclyDecryptableEvent.parameters.push(
    new ethereum.EventParam("handle", ethereum.Value.fromFixedBytes(handle))
  )

  return markedAsPubliclyDecryptableEvent
}

export function createNoxComputeUpdatedEvent(
  newNoxCompute: Address
): NoxComputeUpdated {
  let noxComputeUpdatedEvent = changetype<NoxComputeUpdated>(newMockEvent())

  noxComputeUpdatedEvent.parameters = new Array()

  noxComputeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newNoxCompute",
      ethereum.Value.fromAddress(newNoxCompute)
    )
  )

  return noxComputeUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

export function createViewerAddedEvent(
  sender: Address,
  viewer: Address,
  handle: Bytes
): ViewerAdded {
  let viewerAddedEvent = changetype<ViewerAdded>(newMockEvent())

  viewerAddedEvent.parameters = new Array()

  viewerAddedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  viewerAddedEvent.parameters.push(
    new ethereum.EventParam("viewer", ethereum.Value.fromAddress(viewer))
  )
  viewerAddedEvent.parameters.push(
    new ethereum.EventParam("handle", ethereum.Value.fromFixedBytes(handle))
  )

  return viewerAddedEvent
}
