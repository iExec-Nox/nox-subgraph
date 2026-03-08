import {
    Add as AddEvent,
    Allowed as AllowedEvent,
    Burn as BurnEvent,
    Div as DivEvent,
    Eq as EqEvent,
    Ge as GeEvent,
    Gt as GtEvent,
    Le as LeEvent,
    Lt as LtEvent,
    MarkedAsPubliclyDecryptable as MarkedAsPubliclyDecryptableEvent,
    Mint as MintEvent,
    Mul as MulEvent,
    Ne as NeEvent,
    PlaintextToEncrypted as PlaintextToEncryptedEvent,
    SafeAdd as SafeAddEvent,
    SafeDiv as SafeDivEvent,
    SafeMul as SafeMulEvent,
    SafeSub as SafeSubEvent,
    Select as SelectEvent,
    Sub as SubEvent,
    Transfer as TransferEvent,
    ViewerAdded as ViewerAddedEvent,
} from '../generated/NoxCompute/NoxCompute';
import {
    createOperation,
    createPlaintextOperation,
    createRole,
    getOrCreateHandle,
} from './utils/utils';

// ============ ACL Handlers ============

export function handleAllowed(event: AllowedEvent): void {
    const handle = getOrCreateHandle(event.params.handle);
    createRole(
        handle,
        event.params.account,
        'ADMIN',
        event.params.sender,
        event.transaction.hash,
        event.logIndex.toI32(),
        event.block.number,
        event.block.timestamp,
    );
    handle.save();
}

export function handleMarkedAsPubliclyDecryptable(event: MarkedAsPubliclyDecryptableEvent): void {
    const handle = getOrCreateHandle(event.params.handle);
    handle.isPubliclyDecryptable = true;
    handle.save();
}

export function handleViewerAdded(event: ViewerAddedEvent): void {
    const handle = getOrCreateHandle(event.params.handle);
    createRole(
        handle,
        event.params.viewer,
        'VIEWER',
        event.params.sender,
        event.transaction.hash,
        event.logIndex.toI32(),
        event.block.number,
        event.block.timestamp,
    );
    handle.save();
}

// ============ PlaintextToEncrypted Handler ============

export function handlePlaintextToEncrypted(event: PlaintextToEncryptedEvent): void {
    createPlaintextOperation(
        event.params.plaintext,
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

// ============ Binary Operation Handlers ============

export function handleAdd(event: AddEvent): void {
    createOperation(
        'Add',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleSub(event: SubEvent): void {
    createOperation(
        'Sub',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleMul(event: MulEvent): void {
    createOperation(
        'Mul',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleDiv(event: DivEvent): void {
    createOperation(
        'Div',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleEq(event: EqEvent): void {
    createOperation(
        'Eq',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleNe(event: NeEvent): void {
    createOperation(
        'Ne',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleLt(event: LtEvent): void {
    createOperation(
        'Lt',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleLe(event: LeEvent): void {
    createOperation(
        'Le',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleGt(event: GtEvent): void {
    createOperation(
        'Gt',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleGe(event: GeEvent): void {
    createOperation(
        'Ge',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

// ============ Safe Operation Handlers ============

export function handleSafeAdd(event: SafeAddEvent): void {
    createOperation(
        'SafeAdd',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.success, event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleSafeSub(event: SafeSubEvent): void {
    createOperation(
        'SafeSub',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.success, event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleSafeMul(event: SafeMulEvent): void {
    createOperation(
        'SafeMul',
        [event.params.leftHandOperand, event.params.rightHandOperand],
        [event.params.success, event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleSafeDiv(event: SafeDivEvent): void {
    createOperation(
        'SafeDiv',
        [event.params.numerator, event.params.denominator],
        [event.params.success, event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

// ============ Ternary Operation Handlers ============

export function handleSelect(event: SelectEvent): void {
    createOperation(
        'Select',
        [event.params.condition, event.params.ifTrue, event.params.ifFalse],
        [event.params.result],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

// ============ Composite Operation Handlers ============

export function handleTransfer(event: TransferEvent): void {
    createOperation(
        'Transfer',
        [event.params.balanceFrom, event.params.balanceTo, event.params.amount],
        [event.params.success, event.params.newBalanceFrom, event.params.newBalanceTo],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleMint(event: MintEvent): void {
    createOperation(
        'Mint',
        [event.params.balanceTo, event.params.amount, event.params.totalSupply],
        [event.params.success, event.params.newBalanceTo, event.params.newTotalSupply],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}

export function handleBurn(event: BurnEvent): void {
    createOperation(
        'Burn',
        [event.params.balanceFrom, event.params.amount, event.params.totalSupply],
        [event.params.success, event.params.newBalanceFrom, event.params.newTotalSupply],
        event.transaction.hash,
        event.logIndex.toI32(),
    );
}
