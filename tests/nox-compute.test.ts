import { Address, Bytes } from '@graphprotocol/graph-ts';
import { afterAll, assert, clearStore, describe, test } from 'matchstick-as/assembly/index';
import {
    handleAllowed,
    handleMarkedAsPubliclyDecryptable,
    handleViewerAdded,
} from '../src/NoxCompute';
import {
    createAllowedEvent,
    createMarkedAsPubliclyDecryptableEvent,
    createViewerAddedEvent,
} from './nox-compute-utils';

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
            assert.entityCount('HandleRole', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPubliclyDecryptable', 'false');
            assert.fieldEquals('Handle', handleIdHex, 'id', handleIdHex);
        });

        test('HandleRole is created with ADMIN role for Allowed event', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            // Get the role ID (transaction hash + log index)
            const roleId = event.transaction.hash.concatI32(event.logIndex.toI32());
            const roleIdHex = roleId.toHexString();

            assert.entityCount('HandleRole', 1);
            assert.fieldEquals('HandleRole', roleIdHex, 'role', 'ADMIN');
            assert.fieldEquals('HandleRole', roleIdHex, 'account', account1.toHexString());
            assert.fieldEquals('HandleRole', roleIdHex, 'grantedBy', sender1.toHexString());
        });
    });

    describe('HandleRole ADMIN Updates', () => {
        test('First ADMIN role is created for Allowed event', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            assert.entityCount('Handle', 1);
            assert.entityCount('HandleRole', 1);
        });

        test('Multiple ADMIN roles are created for different accounts', () => {
            clearStore();
            const event1 = createAllowedEvent(sender1, account1, handleId, 1);
            const event2 = createAllowedEvent(sender1, account2, handleId, 2);
            handleAllowed(event1);
            handleAllowed(event2);

            assert.entityCount('Handle', 1);
            assert.entityCount('HandleRole', 2);
        });

        test('Multiple ADMIN roles can be created for same account (historical record)', () => {
            clearStore();
            const event1 = createAllowedEvent(sender1, account1, handleId, 1);
            const event2 = createAllowedEvent(sender1, account1, handleId, 2);
            handleAllowed(event1);
            handleAllowed(event2);

            // Both events create separate HandleRole entities (historical record)
            assert.entityCount('Handle', 1);
            assert.entityCount('HandleRole', 2);
        });
    });

    describe('HandleRole VIEWER Updates', () => {
        test('VIEWER role is created when ViewerAdded event is processed', () => {
            clearStore();
            const event = createViewerAddedEvent(sender1, viewer1, handleId);
            handleViewerAdded(event);

            const roleId = event.transaction.hash.concatI32(event.logIndex.toI32());
            const roleIdHex = roleId.toHexString();

            assert.entityCount('Handle', 1);
            assert.entityCount('HandleRole', 1);
            assert.fieldEquals('HandleRole', roleIdHex, 'role', 'VIEWER');
            assert.fieldEquals('HandleRole', roleIdHex, 'account', viewer1.toHexString());
            assert.fieldEquals('HandleRole', roleIdHex, 'grantedBy', sender1.toHexString());
        });

        test('Multiple VIEWER roles are created for different viewers', () => {
            clearStore();
            const event1 = createViewerAddedEvent(sender1, viewer1, handleId, 1);
            const event2 = createViewerAddedEvent(sender1, viewer2, handleId, 2);
            handleViewerAdded(event1);
            handleViewerAdded(event2);

            assert.entityCount('Handle', 1);
            assert.entityCount('HandleRole', 2);
        });

        test('Multiple VIEWER roles can be created for same viewer (historical record)', () => {
            clearStore();
            const event1 = createViewerAddedEvent(sender1, viewer1, handleId, 1);
            const event2 = createViewerAddedEvent(sender1, viewer1, handleId, 2);
            handleViewerAdded(event1);
            handleViewerAdded(event2);

            assert.entityCount('Handle', 1);
            assert.entityCount('HandleRole', 2);
        });
    });

    describe('Handle isPubliclyDecryptable Updates', () => {
        test('Handle isPubliclyDecryptable is set to true when MarkedAsPubliclyDecryptable event is processed', () => {
            clearStore();
            const event = createMarkedAsPubliclyDecryptableEvent(sender1, handleId);
            handleMarkedAsPubliclyDecryptable(event);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPubliclyDecryptable', 'true');
        });

        test('Handle isPubliclyDecryptable remains true after multiple MarkedAsPubliclyDecryptable events', () => {
            clearStore();
            const event1 = createMarkedAsPubliclyDecryptableEvent(sender1, handleId);
            const event2 = createMarkedAsPubliclyDecryptableEvent(sender1, handleId);
            handleMarkedAsPubliclyDecryptable(event1);
            handleMarkedAsPubliclyDecryptable(event2);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.fieldEquals('Handle', handleIdHex, 'isPubliclyDecryptable', 'true');
        });
    });

    describe('Handle Integration Tests', () => {
        test('Handle accumulates roles from multiple event types', () => {
            clearStore();
            const allowedEvent = createAllowedEvent(sender1, account1, handleId, 1);
            const viewerEvent = createViewerAddedEvent(sender1, viewer1, handleId, 2);
            const publicEvent = createMarkedAsPubliclyDecryptableEvent(sender1, handleId, 3);

            handleAllowed(allowedEvent);
            handleViewerAdded(viewerEvent);
            handleMarkedAsPubliclyDecryptable(publicEvent);

            const handleIdHex = handleId.toHexString();
            assert.entityCount('Handle', 1);
            assert.entityCount('HandleRole', 2); // 1 ADMIN + 1 VIEWER
            assert.fieldEquals('Handle', handleIdHex, 'isPubliclyDecryptable', 'true');
        });

        test('HandleRole contains correct metadata', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            const roleId = event.transaction.hash.concatI32(event.logIndex.toI32());
            const roleIdHex = roleId.toHexString();

            assert.fieldEquals('HandleRole', roleIdHex, 'handle', handleId.toHexString());
            assert.fieldEquals('HandleRole', roleIdHex, 'account', account1.toHexString());
            assert.fieldEquals('HandleRole', roleIdHex, 'role', 'ADMIN');
            assert.fieldEquals('HandleRole', roleIdHex, 'grantedBy', sender1.toHexString());
        });
    });

    describe('Multiple Handles', () => {
        test('Multiple handles are created independently', () => {
            clearStore();
            const handle1 = Bytes.fromI32(1_111_111_111);
            const handle2 = Bytes.fromI32(2_222_222_222);

            const event1 = createAllowedEvent(sender1, account1, handle1, 1);
            const event2 = createAllowedEvent(sender1, account1, handle2, 2);

            handleAllowed(event1);
            handleAllowed(event2);

            assert.entityCount('Handle', 2);
            assert.entityCount('HandleRole', 2);
            assert.fieldEquals('Handle', handle1.toHexString(), 'isPubliclyDecryptable', 'false');
            assert.fieldEquals('Handle', handle2.toHexString(), 'isPubliclyDecryptable', 'false');
        });
    });
});
