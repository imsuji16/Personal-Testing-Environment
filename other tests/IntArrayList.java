public class IntArrayList {
    private int[] data;
    private int size;

    public IntArrayList(int size) {
        this.data = new int[size];
        this.size = size;
    }

    public void set(int index, int value) {
        this.data[index] = value;
    }

    public int get(int index) {
        return this.data[index];
    }

    public int size() {
        return this.size;
    }

    public void insert(int index, int value) {
        this.size += 1;
        int[] out = new int[this.size];
        for (int i = 0; i < index; i++) {
            out[i] = this.data[i];
        }
        out[index] = value;
        for (int i = index + 1; i < this.size; i++) {
            out[i] = this.data[i - 1];
        }
        this.data = out;
    }

    public void remove(int index) {
        this.size -= 1;
        int[] out = new int[this.size];
        for (int i = 0; i < index; i++) {
            out[i] = this.data[i];
        }
        for (int i = index; i < this.size; i++) {
            out[i] = this.data[i + 1];
        }
        this.data = out;
    }

    public void add(int value) {
        this.size += 1;
        int[] out = new int[this.size];
        for (int i = 0; i < this.size - 1; i++) {
            out[i] = this.data[i];
        }
        out[this.size - 1] = value;
        this.data = out;

    }

    public boolean equals(IntArrayList arr) {
        if (this.size != arr.size) {
            return false;
        }
        for (int i = 0; i < this.size; i++) {
            if (this.data[i] != arr.data[i]) {
                return false;
            }
        }
        return true;
    }

    public String toString() {
        String out = "[";
        for (int i = 0; i < this.size - 1; i++) {
            out += this.data[i] + ", ";
        }
        out += this.data[this.size - 1] + "]";
        return out;
    }

    public static void main(String[] args) {
        IntArrayList array = new IntArrayList(5);
        array.set(0, 1);
        array.set(1, 2);
        array.set(2, 3);
        array.set(3, 4);
        array.set(4, 5);
        System.out.println("new array: " + array.toString());
        array.add(6);
        System.out.println("array.add(6): " + array.toString());
        array.set(0, 100);
        System.out.println("array.set(0, 100): " + array.toString());
        array.insert(1, 200);
        System.out.println("array.insert(1, 200): " + array.toString());
        array.remove(1);
        System.out.println("array.remove(1): " + array.toString());
        System.out.println("array.get(0): " + array.get(0));
        System.out.println("array.size(): " + array.size());
        IntArrayList array2 = new IntArrayList(6);
        array2.set(0, 100);
        array2.set(1, 2);
        array2.set(2, 3);
        array2.set(3, 4);
        array2.set(4, 5);
        array2.set(5, 6);
        System.out.println("new array2: " + array2.toString());
        System.out.println("array.equals(array2): " + array.equals(array2));
        array2.add(69);
        System.out.println("array2.add(69): " + array2.toString());
        System.out.println("array.equals(array2): " + array.equals(array2));

        

    }
}
