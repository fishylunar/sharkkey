import shark from "./🦈.js";
import { jest, describe, beforeEach, it, expect } from '@jest/globals'
jest.mock("./🐟/generic.js");
jest.mock("./🐟/cryptography.js");
jest.mock('./🐟/compression.js');
describe('shark', () => {
    let instance;

    beforeEach(() => {
        instance = new shark();
    });

    it('instance should be an instanceof shark', () => {
        expect(instance instanceof shark).toBeTruthy();
    });
});