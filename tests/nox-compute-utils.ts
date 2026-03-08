import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as';
import {
    Add,
    Allowed,
    Burn,
    Div,
    Eq,
    Ge,
    Gt,
    Le,
    Lt,
    MarkedAsPubliclyDecryptable,
    Mint,
    Mul,
    Ne,
    PlaintextToEncrypted,
    SafeAdd,
    SafeDiv,
    SafeMul,
    SafeSub,
    Select,
    Sub,
    Transfer,
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

// ============ PlaintextToEncrypted Event Factory ============

export function createPlaintextToEncryptedEvent(
    caller: Address,
    plaintext: Bytes,
    toType: i32,
    result: Bytes,
    logIndex: i32 = 0,
): PlaintextToEncrypted {
    const event = changetype<PlaintextToEncrypted>(newMockEvent());

    event.transaction.hash = Bytes.fromI32(logIndex);
    event.logIndex = BigInt.fromI32(logIndex);
    event.parameters = [];

    event.parameters.push(new ethereum.EventParam('caller', ethereum.Value.fromAddress(caller)));
    event.parameters.push(
        new ethereum.EventParam('plaintext', ethereum.Value.fromFixedBytes(plaintext)),
    );
    event.parameters.push(new ethereum.EventParam('toType', ethereum.Value.fromI32(toType)));
    event.parameters.push(new ethereum.EventParam('result', ethereum.Value.fromFixedBytes(result)));

    return event;
}

// ============ Binary Operation Event Factories ============

function createBinaryOpEvent<T>(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): T {
    const event = changetype<T>(newMockEvent());

    // Need to use changetype to access ethereum.Event properties
    const ethEvent = changetype<ethereum.Event>(event);
    ethEvent.transaction.hash = Bytes.fromI32(logIndex);
    ethEvent.logIndex = BigInt.fromI32(logIndex);
    ethEvent.parameters = [];

    ethEvent.parameters.push(new ethereum.EventParam('caller', ethereum.Value.fromAddress(caller)));
    ethEvent.parameters.push(
        new ethereum.EventParam('leftHandOperand', ethereum.Value.fromFixedBytes(leftHandOperand)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam(
            'rightHandOperand',
            ethereum.Value.fromFixedBytes(rightHandOperand),
        ),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam('result', ethereum.Value.fromFixedBytes(result)),
    );

    return event;
}

export function createAddEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Add {
    return createBinaryOpEvent<Add>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createSubEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Sub {
    return createBinaryOpEvent<Sub>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createMulEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Mul {
    return createBinaryOpEvent<Mul>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createDivEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Div {
    return createBinaryOpEvent<Div>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createEqEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Eq {
    return createBinaryOpEvent<Eq>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createNeEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Ne {
    return createBinaryOpEvent<Ne>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createLtEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Lt {
    return createBinaryOpEvent<Lt>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createLeEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Le {
    return createBinaryOpEvent<Le>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createGtEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Gt {
    return createBinaryOpEvent<Gt>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

export function createGeEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Ge {
    return createBinaryOpEvent<Ge>(caller, leftHandOperand, rightHandOperand, result, logIndex);
}

// ============ Safe Operation Event Factories ============

function createSafeOpEvent<T>(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    success: Bytes,
    result: Bytes,
    leftParamName: string,
    rightParamName: string,
    logIndex: i32 = 0,
): T {
    const event = changetype<T>(newMockEvent());

    const ethEvent = changetype<ethereum.Event>(event);
    ethEvent.transaction.hash = Bytes.fromI32(logIndex);
    ethEvent.logIndex = BigInt.fromI32(logIndex);
    ethEvent.parameters = [];

    ethEvent.parameters.push(new ethereum.EventParam('caller', ethereum.Value.fromAddress(caller)));
    ethEvent.parameters.push(
        new ethereum.EventParam(leftParamName, ethereum.Value.fromFixedBytes(leftHandOperand)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam(rightParamName, ethereum.Value.fromFixedBytes(rightHandOperand)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam('success', ethereum.Value.fromFixedBytes(success)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam('result', ethereum.Value.fromFixedBytes(result)),
    );

    return event;
}

export function createSafeAddEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    success: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): SafeAdd {
    return createSafeOpEvent<SafeAdd>(
        caller,
        leftHandOperand,
        rightHandOperand,
        success,
        result,
        'leftHandOperand',
        'rightHandOperand',
        logIndex,
    );
}

export function createSafeSubEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    success: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): SafeSub {
    return createSafeOpEvent<SafeSub>(
        caller,
        leftHandOperand,
        rightHandOperand,
        success,
        result,
        'leftHandOperand',
        'rightHandOperand',
        logIndex,
    );
}

export function createSafeMulEvent(
    caller: Address,
    leftHandOperand: Bytes,
    rightHandOperand: Bytes,
    success: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): SafeMul {
    return createSafeOpEvent<SafeMul>(
        caller,
        leftHandOperand,
        rightHandOperand,
        success,
        result,
        'leftHandOperand',
        'rightHandOperand',
        logIndex,
    );
}

export function createSafeDivEvent(
    caller: Address,
    numerator: Bytes,
    denominator: Bytes,
    success: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): SafeDiv {
    return createSafeOpEvent<SafeDiv>(
        caller,
        numerator,
        denominator,
        success,
        result,
        'numerator',
        'denominator',
        logIndex,
    );
}

// ============ Select Event Factory ============

export function createSelectEvent(
    caller: Address,
    condition: Bytes,
    ifTrue: Bytes,
    ifFalse: Bytes,
    result: Bytes,
    logIndex: i32 = 0,
): Select {
    const event = changetype<Select>(newMockEvent());

    const ethEvent = changetype<ethereum.Event>(event);
    ethEvent.transaction.hash = Bytes.fromI32(logIndex);
    ethEvent.logIndex = BigInt.fromI32(logIndex);
    ethEvent.parameters = [];

    ethEvent.parameters.push(new ethereum.EventParam('caller', ethereum.Value.fromAddress(caller)));
    ethEvent.parameters.push(
        new ethereum.EventParam('condition', ethereum.Value.fromFixedBytes(condition)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam('ifTrue', ethereum.Value.fromFixedBytes(ifTrue)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam('ifFalse', ethereum.Value.fromFixedBytes(ifFalse)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam('result', ethereum.Value.fromFixedBytes(result)),
    );

    return event;
}

// ============ Composite Operation Event Factories ============

function createCompositeOpEvent<T>(
    caller: Address,
    param1Name: string,
    param1: Bytes,
    param2Name: string,
    param2: Bytes,
    param3Name: string,
    param3: Bytes,
    successName: string,
    success: Bytes,
    out1Name: string,
    out1: Bytes,
    out2Name: string,
    out2: Bytes,
    logIndex: i32 = 0,
): T {
    const event = changetype<T>(newMockEvent());

    const ethEvent = changetype<ethereum.Event>(event);
    ethEvent.transaction.hash = Bytes.fromI32(logIndex);
    ethEvent.logIndex = BigInt.fromI32(logIndex);
    ethEvent.parameters = [];

    ethEvent.parameters.push(new ethereum.EventParam('caller', ethereum.Value.fromAddress(caller)));
    ethEvent.parameters.push(
        new ethereum.EventParam(param1Name, ethereum.Value.fromFixedBytes(param1)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam(param2Name, ethereum.Value.fromFixedBytes(param2)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam(param3Name, ethereum.Value.fromFixedBytes(param3)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam(successName, ethereum.Value.fromFixedBytes(success)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam(out1Name, ethereum.Value.fromFixedBytes(out1)),
    );
    ethEvent.parameters.push(
        new ethereum.EventParam(out2Name, ethereum.Value.fromFixedBytes(out2)),
    );

    return event;
}

export function createTransferEvent(
    caller: Address,
    balanceFrom: Bytes,
    balanceTo: Bytes,
    amount: Bytes,
    success: Bytes,
    newBalanceFrom: Bytes,
    newBalanceTo: Bytes,
    logIndex: i32 = 0,
): Transfer {
    return createCompositeOpEvent<Transfer>(
        caller,
        'balanceFrom',
        balanceFrom,
        'balanceTo',
        balanceTo,
        'amount',
        amount,
        'success',
        success,
        'newBalanceFrom',
        newBalanceFrom,
        'newBalanceTo',
        newBalanceTo,
        logIndex,
    );
}

export function createMintEvent(
    caller: Address,
    balanceTo: Bytes,
    amount: Bytes,
    totalSupply: Bytes,
    success: Bytes,
    newBalanceTo: Bytes,
    newTotalSupply: Bytes,
    logIndex: i32 = 0,
): Mint {
    return createCompositeOpEvent<Mint>(
        caller,
        'balanceTo',
        balanceTo,
        'amount',
        amount,
        'totalSupply',
        totalSupply,
        'success',
        success,
        'newBalanceTo',
        newBalanceTo,
        'newTotalSupply',
        newTotalSupply,
        logIndex,
    );
}

export function createBurnEvent(
    caller: Address,
    balanceFrom: Bytes,
    amount: Bytes,
    totalSupply: Bytes,
    success: Bytes,
    newBalanceFrom: Bytes,
    newTotalSupply: Bytes,
    logIndex: i32 = 0,
): Burn {
    return createCompositeOpEvent<Burn>(
        caller,
        'balanceFrom',
        balanceFrom,
        'amount',
        amount,
        'totalSupply',
        totalSupply,
        'success',
        success,
        'newBalanceFrom',
        newBalanceFrom,
        'newTotalSupply',
        newTotalSupply,
        logIndex,
    );
}
