import gravatar from '../../utils/gravatar';

test('Gravatar Function Test', () => {
  const email = 'lluis13lamata@gmail.com';
  const gravatarUrl =
    'https://gravatar.com/avatar/c6c0b114c05a33428ba7282d798276ac';

  expect(gravatarUrl).toEqual(gravatar(email));
});
