import { Address, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as';
import { Allowed, MarkedAsPubliclyDecryptable, ViewerAdded } from '../generated/ACL/ACL';

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
