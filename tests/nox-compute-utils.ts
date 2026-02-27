import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as';
import {
    Allowed,
    MarkedAsPubliclyDecryptable,
    ViewerAdded,
} from '../generated/NoxCompute/NoxCompute';

export function createAllowedEvent(
    sender: Address,
    account: Address,
    handle: Bytes,
    logIndex: i32 = 0,
): Allowed {
    const allowedEvent = changetype<Allowed>(newMockEvent());

    // Set unique transaction hash and log index for each event
    allowedEvent.transaction.hash = Bytes.fromI32(logIndex);
    allowedEvent.logIndex = BigInt.fromI32(logIndex);

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

export function createMarkedAsPubliclyDecryptableEvent(
    sender: Address,
    handle: Bytes,
    logIndex: i32 = 0,
): MarkedAsPubliclyDecryptable {
    const markedAsPubliclyDecryptableEvent =
        changetype<MarkedAsPubliclyDecryptable>(newMockEvent());

    // Set unique transaction hash and log index for each event
    markedAsPubliclyDecryptableEvent.transaction.hash = Bytes.fromI32(logIndex);
    markedAsPubliclyDecryptableEvent.logIndex = BigInt.fromI32(logIndex);

    markedAsPubliclyDecryptableEvent.parameters = [];

    markedAsPubliclyDecryptableEvent.parameters.push(
        new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
    );
    markedAsPubliclyDecryptableEvent.parameters.push(
        new ethereum.EventParam('handle', ethereum.Value.fromFixedBytes(handle)),
    );

    return markedAsPubliclyDecryptableEvent;
}

export function createViewerAddedEvent(
    sender: Address,
    viewer: Address,
    handle: Bytes,
    logIndex: i32 = 0,
): ViewerAdded {
    const viewerAddedEvent = changetype<ViewerAdded>(newMockEvent());

    // Set unique transaction hash and log index for each event
    viewerAddedEvent.transaction.hash = Bytes.fromI32(logIndex);
    viewerAddedEvent.logIndex = BigInt.fromI32(logIndex);

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
