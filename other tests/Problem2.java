public class Problem2 {
    public static void fizzBuzz(int n) {
        if (n % 3 == 0 && n % 5 == 0) {
            System.out.println("FizzBuzz");
        } else if (n % 3 == 0) {
            System.out.println("Fizz");
        } else if (n % 5 == 0) {
            System.out.println("Buzz");
        } else {
            System.out.println(n);
        }
    }
    
    public static void main(String[] args) {
        fizzBuzz(225);
        fizzBuzz(3);
        fizzBuzz(5);
        fizzBuzz(7);
    }
}
