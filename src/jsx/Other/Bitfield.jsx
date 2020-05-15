

export default class Bitfield {
    constructor(bits = 0) {
        this.bits = bits;
    }


    get(position) {
       return (this.bits & (1 << position)) == 0 ? false : true;
    }

    set(bits) {
      this.bits |= bits;
    }

    raw(position) {
        return this.bits & (1 << position)
    }

    clear(position) {
        this.bits = this.bits & ~(1 << position);
    }

    update(position) {
        this.bits = (this.bits | (1 << position));
    }


}