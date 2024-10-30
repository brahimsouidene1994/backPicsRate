const  calculator= require('../app/controllers/demo')
test('string with a single number should result in the number itself', () => {
    expect(calculator.add('1')).toBe(1);
});