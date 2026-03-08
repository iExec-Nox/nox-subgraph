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
    handlePlaintextToEncrypted,
    handleSafeAdd,
    handleSafeDiv,
    handleSafeMul,
    handleSafeSub,
    handleSelect,
    handleSub,
    handleTransfer,
    handleViewerAdded,
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
    createPlaintextToEncryptedEvent,
    createSafeAddEvent,
    createSafeDivEvent,
    createSafeMulEvent,
    createSafeSubEvent,
    createSelectEvent,
    createSubEvent,
    createTransferEvent,
    createViewerAddedEvent,
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

function operandsString(ops: Bytes[]): string {
    const parts: string[] = [];
    for (let i = 0; i < ops.length; i++) {
        parts.push(ops[i].toHexString());
    }
    return '[' + parts.join(', ') + ']';
}

function getOperationId(logIndex: i32): Bytes {
    return Bytes.fromI32(logIndex).concatI32(logIndex);
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

// ============ PlaintextToEncrypted Tests ============

describe('PlaintextToEncrypted Tests', () => {
    afterAll(() => {
        clearStore();
    });

    test('PlaintextToEncrypted creates Operation with plaintext and output Handle', () => {
        clearStore();
        const event = createPlaintextToEncryptedEvent(caller1, plaintextValue, 4, resultHandle);
        handlePlaintextToEncrypted(event);

        assert.entityCount('Handle', 1);
        assert.entityCount('Operation', 1);

        const opId = getOperationId(0).toHexString();
        assert.fieldEquals('Operation', opId, 'operator', 'PlaintextToEncrypted');
        assert.fieldEquals('Operation', opId, 'plaintext', plaintextValue.toHexString());
        assert.fieldEquals('Operation', opId, 'operands', '[]');

        const resultHex = resultHandle.toHexString();
        assert.fieldEquals('Handle', resultHex, 'operation', opId);
        assert.fieldEquals('Handle', resultHex, 'isPubliclyDecryptable', 'false');
    });

    test('PlaintextToEncrypted handle can also have roles', () => {
        clearStore();
        const ptEvent = createPlaintextToEncryptedEvent(
            caller1,
            plaintextValue,
            4,
            resultHandle,
            1,
        );
        handlePlaintextToEncrypted(ptEvent);

        const allowedEvent = createAllowedEvent(sender1, account1, resultHandle, 2);
        handleAllowed(allowedEvent);

        const opId = getOperationId(1).toHexString();
        assert.fieldEquals('Operation', opId, 'operator', 'PlaintextToEncrypted');
        assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
        assert.entityCount('HandleRole', 1);
    });

    test('PlaintextToEncrypted handle used as operand in binary op', () => {
        clearStore();
        const ptEvent = createPlaintextToEncryptedEvent(caller1, plaintextValue, 4, leftOperand, 1);
        handlePlaintextToEncrypted(ptEvent);

        const addEvent = createAddEvent(caller1, leftOperand, rightOperand, resultHandle, 2);
        handleAdd(addEvent);

        const ptOpId = getOperationId(1).toHexString();
        assert.fieldEquals('Operation', ptOpId, 'operator', 'PlaintextToEncrypted');
        assert.fieldEquals('Handle', leftOperand.toHexString(), 'operation', ptOpId);

        const addOpId = getOperationId(2).toHexString();
        assert.fieldEquals('Operation', addOpId, 'operator', 'Add');
        assert.fieldEquals(
            'Operation',
            addOpId,
            'operands',
            operandsString([leftOperand, rightOperand]),
        );
        assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', addOpId);
    });
});

// ============ Binary Operation Tests ============

describe('Handle Lineage Tests', () => {
    afterAll(() => {
        clearStore();
    });

    describe('Add Operation', () => {
        test('Add creates Operation with operands and output Handle', () => {
            clearStore();
            const event = createAddEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleAdd(event);

            assert.entityCount('Handle', 3);
            assert.entityCount('Operation', 1);

            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Add');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand]),
            );
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
        });

        test('Add operand handles are created without operation', () => {
            clearStore();
            const event = createAddEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleAdd(event);

            assert.fieldEquals(
                'Handle',
                leftOperand.toHexString(),
                'isPubliclyDecryptable',
                'false',
            );
            assert.fieldEquals(
                'Handle',
                rightOperand.toHexString(),
                'isPubliclyDecryptable',
                'false',
            );
        });
    });

    describe('Sub Operation', () => {
        test('Sub creates Operation with correct operands', () => {
            clearStore();
            const event = createSubEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleSub(event);

            assert.entityCount('Handle', 3);
            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Sub');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand]),
            );
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
        });
    });

    describe('Mul Operation', () => {
        test('Mul creates Operation with correct operands', () => {
            clearStore();
            const event = createMulEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleMul(event);

            assert.entityCount('Handle', 3);
            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Mul');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand]),
            );
        });
    });

    describe('Div Operation', () => {
        test('Div creates Operation with correct operands', () => {
            clearStore();
            const event = createDivEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleDiv(event);

            assert.entityCount('Handle', 3);
            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Div');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand]),
            );
        });
    });

    describe('Comparison Operations', () => {
        test('Eq creates Operation with correct operands', () => {
            clearStore();
            const event = createEqEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleEq(event);

            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Eq');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand]),
            );
        });

        test('Ne creates Operation with correct operator', () => {
            clearStore();
            const event = createNeEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleNe(event);

            assert.fieldEquals('Operation', getOperationId(0).toHexString(), 'operator', 'Ne');
        });

        test('Lt creates Operation with correct operator', () => {
            clearStore();
            const event = createLtEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleLt(event);

            assert.fieldEquals('Operation', getOperationId(0).toHexString(), 'operator', 'Lt');
        });

        test('Le creates Operation with correct operator', () => {
            clearStore();
            const event = createLeEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleLe(event);

            assert.fieldEquals('Operation', getOperationId(0).toHexString(), 'operator', 'Le');
        });

        test('Gt creates Operation with correct operator', () => {
            clearStore();
            const event = createGtEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleGt(event);

            assert.fieldEquals('Operation', getOperationId(0).toHexString(), 'operator', 'Gt');
        });

        test('Ge creates Operation with correct operator', () => {
            clearStore();
            const event = createGeEvent(caller1, leftOperand, rightOperand, resultHandle);
            handleGe(event);

            assert.fieldEquals('Operation', getOperationId(0).toHexString(), 'operator', 'Ge');
        });
    });

    describe('Safe Operations', () => {
        test('SafeAdd creates one Operation with two output handles', () => {
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
            assert.entityCount('Operation', 1);

            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'SafeAdd');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand]),
            );
            assert.fieldEquals('Handle', successHandle.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
        });

        test('SafeSub creates one Operation with two output handles', () => {
            clearStore();
            const event = createSafeSubEvent(
                caller1,
                leftOperand,
                rightOperand,
                successHandle,
                resultHandle,
            );
            handleSafeSub(event);

            assert.entityCount('Operation', 1);
            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'SafeSub');
            assert.fieldEquals('Handle', successHandle.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
        });

        test('SafeMul creates one Operation with two output handles', () => {
            clearStore();
            const event = createSafeMulEvent(
                caller1,
                leftOperand,
                rightOperand,
                successHandle,
                resultHandle,
            );
            handleSafeMul(event);

            assert.entityCount('Operation', 1);
            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'SafeMul');
            assert.fieldEquals('Handle', successHandle.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
        });

        test('SafeDiv creates one Operation with two output handles', () => {
            clearStore();
            const event = createSafeDivEvent(
                caller1,
                leftOperand,
                rightOperand,
                successHandle,
                resultHandle,
            );
            handleSafeDiv(event);

            assert.entityCount('Operation', 1);
            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'SafeDiv');
            assert.fieldEquals('Handle', successHandle.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
        });
    });

    describe('Lineage Integration', () => {
        test('Handle created by operation can also have roles', () => {
            clearStore();
            const addEvent = createAddEvent(caller1, leftOperand, rightOperand, resultHandle, 1);
            handleAdd(addEvent);

            const allowedEvent = createAllowedEvent(sender1, account1, resultHandle, 2);
            handleAllowed(allowedEvent);

            const opId = getOperationId(1).toHexString();
            assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
            assert.fieldEquals('Operation', opId, 'operator', 'Add');
            assert.entityCount('HandleRole', 1);
        });

        test('Handle without operation has no operation field', () => {
            clearStore();
            const event = createAllowedEvent(sender1, account1, handleId);
            handleAllowed(event);

            assert.fieldEquals('Handle', handleId.toHexString(), 'isPubliclyDecryptable', 'false');
            assert.entityCount('Handle', 1);
            assert.entityCount('Operation', 0);
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

            const addOpId = getOperationId(1).toHexString();
            assert.fieldEquals('Operation', addOpId, 'operator', 'Add');
            assert.fieldEquals(
                'Operation',
                addOpId,
                'operands',
                operandsString([leftOperand, rightOperand]),
            );
            assert.fieldEquals('Handle', intermediateResult.toHexString(), 'operation', addOpId);

            const mulOpId = getOperationId(2).toHexString();
            assert.fieldEquals('Operation', mulOpId, 'operator', 'Mul');
            assert.fieldEquals(
                'Operation',
                mulOpId,
                'operands',
                operandsString([intermediateResult, rightOperand]),
            );
            assert.fieldEquals('Handle', finalResult.toHexString(), 'operation', mulOpId);

            assert.entityCount('Handle', 4);
            assert.entityCount('Operation', 2);
        });
    });
});

// ============ Select Tests ============

describe('Select Operation Tests', () => {
    afterAll(() => {
        clearStore();
    });

    test('Select creates Operation with 3 operands', () => {
        clearStore();
        const condition = Bytes.fromI32(10);
        const ifTrue = Bytes.fromI32(20);
        const ifFalse = Bytes.fromI32(30);
        const event = createSelectEvent(caller1, condition, ifTrue, ifFalse, resultHandle);
        handleSelect(event);

        assert.entityCount('Handle', 4);
        assert.entityCount('Operation', 1);

        const opId = getOperationId(0).toHexString();
        assert.fieldEquals('Operation', opId, 'operator', 'Select');
        assert.fieldEquals(
            'Operation',
            opId,
            'operands',
            operandsString([condition, ifTrue, ifFalse]),
        );
        assert.fieldEquals('Handle', resultHandle.toHexString(), 'operation', opId);
    });
});

// ============ Composite Operation Tests ============

describe('Composite Operation Tests', () => {
    afterAll(() => {
        clearStore();
    });

    describe('Transfer', () => {
        test('Transfer creates one Operation with 3 inputs and 3 outputs', () => {
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
            assert.entityCount('Operation', 1);

            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Transfer');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand, thirdOperand]),
            );
            assert.fieldEquals('Handle', output1.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', output2.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', output3.toHexString(), 'operation', opId);
        });
    });

    describe('Mint', () => {
        test('Mint creates one Operation with 3 inputs and 3 outputs', () => {
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
            assert.entityCount('Operation', 1);

            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Mint');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand, thirdOperand]),
            );
            assert.fieldEquals('Handle', output1.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', output2.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', output3.toHexString(), 'operation', opId);
        });
    });

    describe('Burn', () => {
        test('Burn creates one Operation with 3 inputs and 3 outputs', () => {
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
            assert.entityCount('Operation', 1);

            const opId = getOperationId(0).toHexString();
            assert.fieldEquals('Operation', opId, 'operator', 'Burn');
            assert.fieldEquals(
                'Operation',
                opId,
                'operands',
                operandsString([leftOperand, rightOperand, thirdOperand]),
            );
            assert.fieldEquals('Handle', output1.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', output2.toHexString(), 'operation', opId);
            assert.fieldEquals('Handle', output3.toHexString(), 'operation', opId);
        });
    });
});
