/*
*   Stack implementation in JavaScript
*/

function Stack() {
    this.top = null;
    this.count = 0;

    this.GetCount = function () {
        return this.count;
    }

    this.GetTop = function () {
        return this.top;
    }

    this.Push = function (data) {
        var node = {
            data: data,
            next: null
        }

        node.next = this.top;
        this.top = node;

        this.count++;
    }

    this.Peek = function () {
        if (this.top === null) {
            return null;
        } else {
            return this.top.data;
        }
    }

    this.AbsPeek = function () {
        if (this.top === null) {
            return null;
        } else {
            return Math.abs (this.top.data);
        }
    }

    /* return 1 if the top of the stack is positive, -1 if it is negative */
    this.UnitPeek = function () {
        if (this.top === null) {
            return null;
        } else {
            return this.top.data > 0 ? 1 : -1;
        }
    }


    this.Pop = function () {
        if (this.top === null) {
            return null;
        } else {
            var out = this.top;
            this.top = this.top.next;
            if (this.count > 0) {
                this.count--;
            }

            return out.data;
        }
    }

    this.DisplayAll = function () {
        if (this.top === null) {
            return null;
        } else {
            var arr = new Array();

            var current = this.top;
            //console.log(current);
            for (var i = 0; i < this.count; i++) {
                arr[i] = current.data;
                current = current.next;
            }

            return arr;
        }
    }
}