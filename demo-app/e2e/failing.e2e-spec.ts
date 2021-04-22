fixture('Failing').page('http://localhost:4200');

test('foo equals bar', async t => await t.expect('foo').eql('bar'));
