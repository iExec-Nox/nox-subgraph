import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as';
import {
    Allowed,
    Initialized,
    MarkedAsPubliclyDecryptable,
    NoxComputeUpdated,
    OwnershipTransferred,
    Upgraded,
    ViewerAdded,
} from '../generated/ACL/ACL';

export function createAllowedEvent(sender: Address, account: Address, handle: Bytes): Allowed {
    const allowedEvent = changetype<Allowed>(newMockEvent());

    allowedEvent.parameters = [];

    allowedEvent.parameters.push(
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
    );
    allowedEvent.parameters.push(
        new ethereum.EventParam('account', ethereum.Value.fromAddress(account)),
    );
    allowedEvent.parameters.push(
        new ethereum.EventParam('handle', ethereum.Value.fromFixedBytes(handle)),
    );

    return allowedEvent;
}

export function createInitializedEvent(version: BigInt): Initialized {
    const initializedEvent = changetype<Initialized>(newMockEvent());

    initializedEvent.parameters = [];

    initializedEvent.parameters.push(
        new ethereum.EventParam('version', ethereum.Value.fromUnsignedBigInt(version)),
    );

    return initializedEvent;
}

export function createMarkedAsPubliclyDecryptableEvent(
    sender: Address,
    handle: Bytes,
): MarkedAsPubliclyDecryptable {
    const markedAsPubliclyDecryptableEvent =
        changetype<MarkedAsPubliclyDecryptable>(newMockEvent());

    markedAsPubliclyDecryptableEvent.parameters = [];

    markedAsPubliclyDecryptableEvent.parameters.push(
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
    );
    markedAsPubliclyDecryptableEvent.parameters.push(
        new ethereum.EventParam('handle', ethereum.Value.fromFixedBytes(handle)),
    );

    return markedAsPubliclyDecryptableEvent;
}

export function createNoxComputeUpdatedEvent(newNoxCompute: Address): NoxComputeUpdated {
    const noxComputeUpdatedEvent = changetype<NoxComputeUpdated>(newMockEvent());

    noxComputeUpdatedEvent.parameters = [];

    noxComputeUpdatedEvent.parameters.push(
        new ethereum.EventParam('newNoxCompute', ethereum.Value.fromAddress(newNoxCompute)),
    );

    return noxComputeUpdatedEvent;
}

export function createOwnershipTransferredEvent(
    previousOwner: Address,
    newOwner: Address,
): OwnershipTransferred {
    const ownershipTransferredEvent = changetype<OwnershipTransferred>(newMockEvent());

    ownershipTransferredEvent.parameters = [];

    ownershipTransferredEvent.parameters.push(
        new ethereum.EventParam('previousOwner', ethereum.Value.fromAddress(previousOwner)),
    );
    ownershipTransferredEvent.parameters.push(
        new ethereum.EventParam('newOwner', ethereum.Value.fromAddress(newOwner)),
    );

    return ownershipTransferredEvent;
}

export function createUpgradedEvent(implementation: Address): Upgraded {
    const upgradedEvent = changetype<Upgraded>(newMockEvent());

    upgradedEvent.parameters = [];

    upgradedEvent.parameters.push(
        new ethereum.EventParam('implementation', ethereum.Value.fromAddress(implementation)),
    );

    return upgradedEvent;
}

export function createViewerAddedEvent(
    sender: Address,
    viewer: Address,
    handle: Bytes,
): ViewerAdded {
    const viewerAddedEvent = changetype<ViewerAdded>(newMockEvent());

    viewerAddedEvent.parameters = [];

    viewerAddedEvent.parameters.push(
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
    );
    viewerAddedEvent.parameters.push(
        new ethereum.EventParam('viewer', ethereum.Value.fromAddress(viewer)),
    );
    viewerAddedEvent.parameters.push(
        new ethereum.EventParam('handle', ethereum.Value.fromFixedBytes(handle)),
    );

    return viewerAddedEvent;
}
