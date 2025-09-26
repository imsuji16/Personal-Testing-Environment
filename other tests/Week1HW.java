// resources used: Stack Overflow & w3schools
import java.util.ArrayList;
import java.util.List;
public class Week1HW {
    public static boolean isPrime(int num) {
        if (num <= 1 || (num != 2 && num % 2 == 0)) {
            return false;
        }
        for (int i = 3; Math.pow(i, 2) < num; i += 2) {
            if (num % i == 0) {
                return false;
            }
        }
        return true;
    }
    public static int[] returnPrimes(int nums[]) {
        List<Integer> primeArrayList = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (isPrime(nums[i])) {
                primeArrayList.add(nums[i]);
            }
        }
        int[] primeArray = new int[primeArrayList.size()];
        for (int j = 0; j < primeArrayList.size(); j++) {
            primeArray[j] = primeArrayList.get(j);
        }
        return primeArray;
    }
    public static void main(String[] args) {
        int[] numArray = new int[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}; // put any numbers you want here
        int[] primeNums = returnPrimes(numArray);
        for (int i = 0; i < primeNums.length; i++) {
            System.out.print(primeNums[i] + " ");
        }
    }
}