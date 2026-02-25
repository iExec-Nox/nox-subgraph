import { Address, Bytes } from '@graphprotocol/graph-ts';
import {
    afterAll,
    assert,
    beforeAll,
    clearStore,
    describe,
    test,
} from 'matchstick-as/assembly/index';
import { handleAllowed } from '../src/acl';
import { createAllowedEvent } from './acl-utils';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe('Describe entity assertions', () => {
    beforeAll(() => {
        const sender = Address.fromString('0x0000000000000000000000000000000000000001');
        const account = Address.fromString('0x0000000000000000000000000000000000000001');
        const handle = Bytes.fromI32(1_234_567_890);
        const newAllowedEvent = createAllowedEvent(sender, account, handle);
        handleAllowed(newAllowedEvent);
    });

    afterAll(() => {
        clearStore();
    });

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

    test('Allowed created and stored', () => {
        assert.entityCount('Allowed', 1);
        const sender = Address.fromString('0x0000000000000000000000000000000000000001');
        const account = Address.fromString('0x0000000000000000000000000000000000000001');
        const handle = Bytes.fromI32(1_234_567_890);
        const testEvent = createAllowedEvent(sender, account, handle);
        // Build the ID the same way the handler does: transaction.hash.concatI32(logIndex.toI32())
        const entityId = testEvent.transaction.hash.concatI32(testEvent.logIndex.toI32());
        const entityIdHex = entityId.toHexString();

        assert.fieldEquals(
            'Allowed',
            entityIdHex,
            'sender',
            '0x0000000000000000000000000000000000000001',
        );
        assert.fieldEquals(
            'Allowed',
            entityIdHex,
            'account',
            '0x0000000000000000000000000000000000000001',
        );
        assert.fieldEquals('Allowed', entityIdHex, 'handle', handle.toHexString());

        // More assert options:
        // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
    });
});
