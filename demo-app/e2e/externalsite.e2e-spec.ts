import { Selector } from 'testcafe';

fixture('Google search').page('http://www.google.com');

test('google logo', async t => await t.expect(Selector('#hplogo').exists).ok());
