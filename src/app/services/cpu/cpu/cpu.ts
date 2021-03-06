import { RegisterHelper } from './register-helper';
import { Memory } from './memory';
import { delay } from 'q';
import { Opcode } from '../custom-types';
import { OpCodeFetcher } from './opcode-fetcher';

export class CPU {

    private readonly EMPTY = 0b0000_0000_0000_0000;

    /* TODO those might be set in the constructor as we are
       emulating the CPU here and not explicitely the GB */
    /*
    On power up, the GameBoy Program Counter is
    initialized to $100 (100 hex) and the instruction found
    at this location in ROM is executed.
    The Program Counter from this point on is controlled,
    indirectly, by the program instructions themselves that
    were generated by the programmer of the ROM cart.
    */
    private readonly PC_INIT = 0x100;

    /*
      The GameBoy stack pointer is initialized to $FFFE on
      power up but a programmer should not rely on this
      setting and rather should explicitly set its value
    */
    private readonly SP_INIT = 0xFFFE;

    private registerHelper: RegisterHelper;

    private cpuStepMS = 5;
    af: number;
    bc: number;
    de: number;
    hl: number;
    sp: number;
    pc: number;

    getA(): number {
        return this.registerHelper.getA();
    }

    getF(): number {
        return this.registerHelper.getF();
    }

    getB(): number {
        return this.registerHelper.getB();
    }

    getC(): number {
        return this.registerHelper.getC();
    }

    getD(): number {
        return this.registerHelper.getD();
    }

    getE(): number {
        return this.registerHelper.getE();
    }

    constructor(private opcodeFetcher: OpCodeFetcher) {
        this.reset();
        this.registerHelper = new RegisterHelper(this);
    }

    reset() {
        this.pc = this.PC_INIT;
        this.sp = this.SP_INIT;
        this.af = this.EMPTY;
        this.bc = this.EMPTY;
        this.de = this.EMPTY;
        this.hl = this.EMPTY;
    }

    step(): Q.Promise<void> {
        const opcode: Opcode = this.opcodeFetcher.fetchOpcode(this.pc);
        const cpuCyclesTaken: number = this.opcodeFetcher.executeOpCode(opcode, this.registerHelper);
        const _delay = cpuCyclesTaken * this.cpuStepMS;
        return delay(_delay);
    }

    setCpuStep(ms: number) {
        this.cpuStepMS = ms;
    }
}
