import { Address, Bytes } from '@graphprotocol/graph-ts';
import { afterAll, assert, clearStore, describe, test } from 'matchstick-as/assembly/index';
import {
    handleAdd,
    handleAllowed,
    handleBurn,
    handleDiv,
    handleEq,
    handleGe,
    handleGt,
    handleLe,
    handleLt,
    handleMarkedAsPubliclyDecryptable,
    handleMint,
    handleMul,
    handleNe,
    handleSafeAdd,
    handleSafeDiv,
    handleSafeMul,
    handleSafeSub,
    handleSelect,
    handleSub,
    handleTransfer,
    handleViewerAdded,
    handleWrapAsPublicHandle,
} from '../src/NoxCompute';
import {
    createAddEvent,
    createAllowedEvent,
    createBurnEvent,
    createDivEvent,
    createEqEvent,
    createGeEvent,
    createGtEvent,
    createLeEvent,
    createLtEvent,
    createMarkedAsPubliclyDecryptableEvent,
    createMintEvent,
    createMulEvent,
    createNeEvent,
    createSafeAddEvent,
    createSafeDivEvent,
    createSafeMulEvent,
    createSafeSubEvent,
    createSelectEvent,
    createSubEvent,
    createTransferEvent,
    createViewerAddedEvent,
    createWrapAsPublicHandleEvent,
} from './nox-compute-utils';

const handleId = Bytes.fromI32(1_234_567_890);
const sender1 = Address.fromString('0x0000000000000000000000000000000000000001');
const account1 = Address.fromString('0x0000000000000000000000000000000000000002');
const account2 = Address.fromString('0x0000000000000000000000000000000000000003');
const viewer1 = Address.fromString('0x0000000000000000000000000000000000000004');
const viewer2 = Address.fromString('0x0000000000000000000000000000000000000005');

const leftOperand = Bytes.fromI32(100);
const rightOperand = Bytes.fromI32(200);
const resultHandle = Bytes.fromI32(300);
const successHandle = Bytes.fromI32(400);
const plaintextValue = Bytes.fromI32(999);
const thirdOperand = Bytes.fromI32(500);
const output1 = Bytes.fromI32(601);
const output2 = Bytes.fromI32(602);
const output3 = Bytes.fromI32(603);
const caller1 = Address.fromString('0x0000000000000000000000000000000000000010');

function handleIdsString(ids: Bytes[]): string {
    const parts: string[] = [];
    for (let i = 0; i < ids.length; i++) {
        parts.push(ids[i].toHexString());
    }
    return '[' + parts.join(', ') + ']';
}

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

// ============ WrapAsPublicHandle Tests ============

describe('WrapAsPublicHandle Tests', () => {
    afterAll(() => {
        clearStore();
    });

    test('WrapAsPublicHandle creates Handle with plaintext and operator', () => {
        clearStore();
        const event = createWrapAsPublicHandleEvent(caller1, plaintextValue, 4, resultHandle);
        handleWrapAsPublicHandle(event);

        assert.entityCount('Handle', 1);

        const resultHex = resultHandle.toHexString();
        assert.fieldEquals('Handle', resultHex, 'operator', 'WrapAsPublicHandle');
        assert.fieldEquals('Handle', resultHex, 'plaintext', plaintextValue.toHexString());
        assert.fieldEquals('Handle', resultHex, 'parentHandles', '[]');
        assert.fieldEquals('Handle', resultHex, 'isPubliclyDecryptable', 'false');
    });

    test('WrapAsPublicHandle handle can also have roles', () => {
        clearStore();
        const ptEvent = createWrapAsPublicHandleEvent(caller1, plaintextValue, 4, resultHandle, 1);
        handleWrapAsPublicHandle(ptEvent);

        const allowedEvent = createAllowedEvent(sender1, account1, resultHandle, 2);
        handleAllowed(allowedEvent);

        assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'WrapAsPublicHandle');
        assert.entityCount('HandleRole', 1);
    });

    test('WrapAsPublicHandle handle used as operand in binary op', () => {
        clearStore();
        const ptEvent = createWrapAsPublicHandleEvent(caller1, plaintextValue, 4, leftOperand, 1);
        handleWrapAsPublicHandle(ptEvent);

        const addEvent = createAddEvent(caller1, leftOperand, rightOperand, resultHandle, 2);
        handleAdd(addEvent);

        assert.fieldEquals('Handle', leftOperand.toHexString(), 'operator', 'WrapAsPublicHandle');
        assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Add');
        assert.fieldEquals(
            'Handle',
            resultHandle.toHexString(),
            'parentHandles',
            handleIdsString([leftOperand, rightOperand]),
        );
    });
});

// ============ Core Primitive Tests ============

describe('Handle Lineage Tests', () => {
    afterAll(() => {
        clearStore();
    });

    describe('Add Operation', () => {
        test('Add creates output Handle with correct operator and parents', () => {
            clearStore();
            const event = createAddEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleAdd(event);

            assert.entityCount('Handle', 3);

            const resultHex = resultHandle.toHexString();
            assert.fieldEquals('Handle', resultHex, 'operator', 'Add');
            assert.fieldEquals(
                'Handle',
                resultHex,
                'parentHandles',
                handleIdsString([leftOperand, rightOperand]),
            );
        });

        test('Add operand handles are created with empty operator', () => {
            clearStore();
            const event = createAddEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleAdd(event);

            assert.fieldEquals(
                'Handle',
                leftOperand.toHexString(),
                'isPubliclyDecryptable',
                'false',
            );
            assert.fieldEquals('Handle', leftOperand.toHexString(), 'operator', '');
            assert.fieldEquals(
                'Handle',
                rightOperand.toHexString(),
                'isPubliclyDecryptable',
                'false',
            );
            assert.fieldEquals('Handle', rightOperand.toHexString(), 'operator', '');
        });

        test('Add updates parent childHandles', () => {
            clearStore();
            const event = createAddEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleAdd(event);

            assert.fieldEquals(
                'Handle',
                leftOperand.toHexString(),
                'childHandles',
                handleIdsString([resultHandle]),
            );
            assert.fieldEquals(
                'Handle',
                rightOperand.toHexString(),
                'childHandles',
                handleIdsString([resultHandle]),
            );
        });
    });

    describe('Sub Operation', () => {
        test('Sub creates Handle with correct operator and parents', () => {
            clearStore();
            const event = createSubEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleSub(event);

            assert.entityCount('Handle', 3);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Sub');
            assert.fieldEquals(
                'Handle',
                resultHandle.toHexString(),
                'parentHandles',
                handleIdsString([leftOperand, rightOperand]),
            );
        });
    });

    describe('Mul Operation', () => {
        test('Mul creates Handle with correct operator and parents', () => {
            clearStore();
            const event = createMulEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleMul(event);

            assert.entityCount('Handle', 3);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Mul');
            assert.fieldEquals(
                'Handle',
                resultHandle.toHexString(),
                'parentHandles',
                handleIdsString([leftOperand, rightOperand]),
            );
        });
    });

    describe('Div Operation', () => {
        test('Div creates Handle with correct operator and parents', () => {
            clearStore();
            const event = createDivEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleDiv(event);

            assert.entityCount('Handle', 3);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Div');
            assert.fieldEquals(
                'Handle',
                resultHandle.toHexString(),
                'parentHandles',
                handleIdsString([leftOperand, rightOperand]),
            );
        });
    });

    describe('Comparison Operations', () => {
        test('Eq creates Handle with correct operator and parents', () => {
            clearStore();
            const event = createEqEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleEq(event);

            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Eq');
            assert.fieldEquals(
                'Handle',
                resultHandle.toHexString(),
                'parentHandles',
                handleIdsString([leftOperand, rightOperand]),
            );
        });

        test('Ne creates Handle with correct operator', () => {
            clearStore();
            const event = createNeEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleNe(event);

            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Ne');
        });

        test('Lt creates Handle with correct operator', () => {
            clearStore();
            const event = createLtEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleLt(event);

            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Lt');
        });

        test('Le creates Handle with correct operator', () => {
            clearStore();
            const event = createLeEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleLe(event);

            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Le');
        });

        test('Gt creates Handle with correct operator', () => {
            clearStore();
            const event = createGtEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleGt(event);

            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Gt');
        });

        test('Ge creates Handle with correct operator', () => {
            clearStore();
            const event = createGeEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleGe(event);

            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Ge');
        });
    });

    describe('Safe Operations', () => {
        test('SafeAdd creates two output handles with same operator and parents', () => {
            clearStore();
            const event = createSafeAddEvent(
                caller1,
                leftOperand,
                rightOperand,
                successHandle,
                resultHandle,
            );
            handleSafeAdd(event);

            assert.entityCount('Handle', 4);

            const parents = handleIdsString([leftOperand, rightOperand]);
            assert.fieldEquals('Handle', successHandle.toHexString(), 'operator', 'SafeAdd');
            assert.fieldEquals('Handle', successHandle.toHexString(), 'parentHandles', parents);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'SafeAdd');
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'parentHandles', parents);
        });

        test('SafeSub creates two output handles with same operator', () => {
            clearStore();
            const event = createSafeSubEvent(
                caller1,
                leftOperand,
                rightOperand,
                successHandle,
                resultHandle,
            );
            handleSafeSub(event);

            assert.fieldEquals('Handle', successHandle.toHexString(), 'operator', 'SafeSub');
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'SafeSub');
        });

        test('SafeMul creates two output handles with same operator', () => {
            clearStore();
            const event = createSafeMulEvent(
                caller1,
                leftOperand,
                rightOperand,
                successHandle,
                resultHandle,
            );
            handleSafeMul(event);

            assert.fieldEquals('Handle', successHandle.toHexString(), 'operator', 'SafeMul');
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'SafeMul');
        });

        test('SafeDiv creates two output handles with same operator', () => {
            clearStore();
            const event = createSafeDivEvent(
                caller1,
                leftOperand,
                rightOperand,
                successHandle,
                resultHandle,
            );
            handleSafeDiv(event);

            assert.fieldEquals('Handle', successHandle.toHexString(), 'operator', 'SafeDiv');
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'SafeDiv');
        });
    });

    describe('Lineage Integration', () => {
        test('Handle created by operation can also have roles', () => {
            clearStore();
            const addEvent = createAddEvent(caller1, leftOperand, rightOperand, resultHandle, 1);
            handleAdd(addEvent);

            const allowedEvent = createAllowedEvent(sender1, account1, resultHandle, 2);
            handleAllowed(allowedEvent);

            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operator', 'Add');
            assert.entityCount('HandleRole', 1);
        });

        test('Handle created from ACL event has empty operator', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            assert.fieldEquals('Handle', handleId.toHexString(), 'isPubliclyDecryptable', 'false');
            assert.fieldEquals('Handle', handleId.toHexString(), 'operator', '');
            assert.entityCount('Handle', 1);
        });

        test('Chained operations: result of Add used as operand of Mul', () => {
            clearStore();
            const intermediateResult = Bytes.fromI32(700);
            const addEvent = createAddEvent(
                caller1,
                leftOperand,
                rightOperand,
                intermediateResult,
                1,
            );
            handleAdd(addEvent);

            const finalResult = Bytes.fromI32(800);
            const mulEvent = createMulEvent(
                caller1,
                intermediateResult,
                rightOperand,
                finalResult,
                2,
            );
            handleMul(mulEvent);

            // Add output
            assert.fieldEquals('Handle', intermediateResult.toHexString(), 'operator', 'Add');
            assert.fieldEquals(
                'Handle',
                intermediateResult.toHexString(),
                'parentHandles',
                handleIdsString([leftOperand, rightOperand]),
            );

            // Mul output
            assert.fieldEquals('Handle', finalResult.toHexString(), 'operator', 'Mul');
            assert.fieldEquals(
                'Handle',
                finalResult.toHexString(),
                'parentHandles',
                handleIdsString([intermediateResult, rightOperand]),
            );

            assert.entityCount('Handle', 4);
        });
    });
});

// ============ Select Tests ============

describe('Select Operation Tests', () => {
    afterAll(() => {
        clearStore();
    });

    test('Select creates Handle with 3 parents', () => {
        clearStore();
        const condition = Bytes.fromI32(10);
        const ifTrue = Bytes.fromI32(20);
        const ifFalse = Bytes.fromI32(30);
        const event = createSelectEvent(caller1, condition, ifTrue, ifFalse, resultHandle);
        handleSelect(event);

        assert.entityCount('Handle', 4);

        const resultHex = resultHandle.toHexString();
        assert.fieldEquals('Handle', resultHex, 'operator', 'Select');
        assert.fieldEquals(
            'Handle',
            resultHex,
            'parentHandles',
            handleIdsString([condition, ifTrue, ifFalse]),
        );
    });
});

// ============ Advanced Function Tests ============

describe('Advanced Function Tests', () => {
    afterAll(() => {
        clearStore();
    });

    describe('Transfer', () => {
        test('Transfer creates 3 output handles with 3 parents', () => {
            clearStore();
            const event = createTransferEvent(
                caller1,
                leftOperand,
                rightOperand,
                thirdOperand,
                output1,
                output2,
                output3,
            );
            handleTransfer(event);

            assert.entityCount('Handle', 6);

            const parents = handleIdsString([leftOperand, rightOperand, thirdOperand]);
            assert.fieldEquals('Handle', output1.toHexString(), 'operator', 'Transfer');
            assert.fieldEquals('Handle', output1.toHexString(), 'parentHandles', parents);
            assert.fieldEquals('Handle', output2.toHexString(), 'operator', 'Transfer');
            assert.fieldEquals('Handle', output2.toHexString(), 'parentHandles', parents);
            assert.fieldEquals('Handle', output3.toHexString(), 'operator', 'Transfer');
            assert.fieldEquals('Handle', output3.toHexString(), 'parentHandles', parents);
        });
    });

    describe('Mint', () => {
        test('Mint creates 3 output handles with 3 parents', () => {
            clearStore();
            const event = createMintEvent(
                caller1,
                leftOperand,
                rightOperand,
                thirdOperand,
                output1,
                output2,
                output3,
            );
            handleMint(event);

            assert.entityCount('Handle', 6);

            const parents = handleIdsString([leftOperand, rightOperand, thirdOperand]);
            assert.fieldEquals('Handle', output1.toHexString(), 'operator', 'Mint');
            assert.fieldEquals('Handle', output1.toHexString(), 'parentHandles', parents);
            assert.fieldEquals('Handle', output2.toHexString(), 'operator', 'Mint');
            assert.fieldEquals('Handle', output2.toHexString(), 'parentHandles', parents);
            assert.fieldEquals('Handle', output3.toHexString(), 'operator', 'Mint');
            assert.fieldEquals('Handle', output3.toHexString(), 'parentHandles', parents);
        });
    });

    describe('Burn', () => {
        test('Burn creates 3 output handles with 3 parents', () => {
            clearStore();
            const event = createBurnEvent(
                caller1,
                leftOperand,
                rightOperand,
                thirdOperand,
                output1,
                output2,
                output3,
            );
            handleBurn(event);

            assert.entityCount('Handle', 6);

            const parents = handleIdsString([leftOperand, rightOperand, thirdOperand]);
            assert.fieldEquals('Handle', output1.toHexString(), 'operator', 'Burn');
            assert.fieldEquals('Handle', output1.toHexString(), 'parentHandles', parents);
            assert.fieldEquals('Handle', output2.toHexString(), 'operator', 'Burn');
            assert.fieldEquals('Handle', output2.toHexString(), 'parentHandles', parents);
            assert.fieldEquals('Handle', output3.toHexString(), 'operator', 'Burn');
            assert.fieldEquals('Handle', output3.toHexString(), 'parentHandles', parents);
        });
    });
});
