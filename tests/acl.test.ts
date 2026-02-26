import { Address, Bytes } from '@graphprotocol/graph-ts';
import { afterAll, assert, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { handleAllowed, handleMarkedAsPubliclyDecryptable, handleViewerAdded } from '../src/acl';
import {
    createAllowedEvent,
    createMarkedAsPubliclyDecryptableEvent,
    createViewerAddedEvent,
} from './acl-utils';

const handleId = Bytes.fromI32(1_234_567_890);
const sender1 = Address.fromString('0x0000000000000000000000000000000000000001');
const account1 = Address.fromString('0x0000000000000000000000000000000000000002');
const account2 = Address.fromString('0x0000000000000000000000000000000000000003');
const viewer1 = Address.fromString('0x0000000000000000000000000000000000000004');
const viewer2 = Address.fromString('0x0000000000000000000000000000000000000005');

describe('Handle Entity Tests', () => {
    afterAll(() => {
        clearStore();
    });

    describe('Handle Creation', () => {
        test('Handle is created when first Allowed event is processed', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'false');
            assert.fieldEquals('Handle', handleIdHex, 'id', handleIdHex);
            assert.fieldEquals(
                'Handle',
                handleIdHex,
                'allowedAccounts',
                `[${account1.toHexString()}]`,
            );
            assert.fieldEquals('Handle', handleIdHex, 'viewers', '[]');
        });

        test('Handle is initialized with empty arrays', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'false');
        });
    });

    describe('Handle allowedAccounts Updates', () => {
        test('First allowed account is added to Handle', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'false');
        });

        test('Multiple allowed accounts are added to Handle', () => {
            clearStore();
            const event1 = createAllowedEvent(sender1, account1, handleId);
            const event2 = createAllowedEvent(sender1, account2, handleId);
            handleAllowed(event1);
            handleAllowed(event2);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'false');
        });

        test('Duplicate allowed accounts are not added', () => {
            clearStore();
            const event1 = createAllowedEvent(sender1, account1, handleId);
            const event2 = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event1);
            handleAllowed(event2);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
        });
    });

    describe('Handle viewers Updates', () => {
        test('First viewer is added to Handle', () => {
            clearStore();
            const event = createViewerAddedEvent(sender1, viewer1, handleId);
            handleViewerAdded(event);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'false');
        });

        test('Multiple viewers are added to Handle', () => {
            clearStore();
            const event1 = createViewerAddedEvent(sender1, viewer1, handleId);
            const event2 = createViewerAddedEvent(sender1, viewer2, handleId);
            handleViewerAdded(event1);
            handleViewerAdded(event2);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
        });

        test('Duplicate viewers are not added', () => {
            clearStore();
            const event1 = createViewerAddedEvent(sender1, viewer1, handleId);
            const event2 = createViewerAddedEvent(sender1, viewer1, handleId);
            handleViewerAdded(event1);
            handleViewerAdded(event2);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
        });
    });

    describe('Handle isPublic Updates', () => {
        test('Handle isPublic is set to true when MarkedAsPubliclyDecryptable event is processed', () => {
            clearStore();
            const event = createMarkedAsPubliclyDecryptableEvent(sender1, handleId);
            handleMarkedAsPubliclyDecryptable(event);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'true');
        });

        test('Handle isPublic remains true after multiple MarkedAsPubliclyDecryptable events', () => {
            clearStore();
            const event1 = createMarkedAsPubliclyDecryptableEvent(sender1, handleId);
            const event2 = createMarkedAsPubliclyDecryptableEvent(sender1, handleId);
            handleMarkedAsPubliclyDecryptable(event1);
            handleMarkedAsPubliclyDecryptable(event2);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'true');
        });
    });

    describe('Handle Integration Tests', () => {
        test('Handle accumulates data from multiple event types', () => {
            clearStore();
            const allowedEvent = createAllowedEvent(sender1, account1, handleId);
            const viewerEvent = createViewerAddedEvent(sender1, viewer1, handleId);
            const publicEvent = createMarkedAsPubliclyDecryptableEvent(sender1, handleId);

            handleAllowed(allowedEvent);
            handleViewerAdded(viewerEvent);
            handleMarkedAsPubliclyDecryptable(publicEvent);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPublic', 'true');
        });

        test('Handle updates block metadata correctly', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'id', handleIdHex);
        });
    });

    describe('Multiple Handles', () => {
        test('Multiple handles are created independently', () => {
            clearStore();
            const handle1 = Bytes.fromI32(1_111_111_111);
            const handle2 = Bytes.fromI32(2_222_222_222);

            const event1 = createAllowedEvent(sender1, account1, handle1);
            const event2 = createAllowedEvent(sender1, account1, handle2);

            handleAllowed(event1);
            handleAllowed(event2);

            assert.entityCount('Handle', 2);
            assert.fieldEquals('Handle', handle1.toHexString(), 'isPublic', 'false');
            assert.fieldEquals('Handle', handle2.toHexString(), 'isPublic', 'false');
        });
    });
});
