import { Selector } from 'testcafe';

fixture('Passing').page('http://localhost:4200');

test('foo equals foo', async t => await t.expect('foo').eql('foo'));
