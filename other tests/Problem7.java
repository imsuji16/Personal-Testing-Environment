public class Problem7 {
    public static int getNthFibonacci(int n) {
        int a = 1;
        int b = 0;
        if (n == 0) {
            return 0;
        } else if (n == 1) {
            return 1;
        } else {
            for (int i = 0; i < n; i++) {
                int out = 0;
                out = a + b;
                a = b;
                b = out;
            }
            return b;
        }
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println(getNthFibonacci(i));
        }
    }
}
    