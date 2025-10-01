public class Problem6 {
    public static void bubbleSort(double[] nums) {
        int numSorted = 0;
        while (numSorted < nums.length) {
            for (int i = 0; i < nums.length - 1; i++) {
                double n1 = nums[i];
                double n2 = nums[i + 1];
                if (n2 < n1) {
                    nums[i] = n2;
                    nums[i + 1] = n1;
                } else {
                    numSorted += 1;
                }
            }
        }
        for (int i = 0; i < nums.length; i++) {
            System.out.print(nums[i] + " ");
        }
    }
    public static void main(String[] args) {
        double[] numArray = new double[] {5.1, 3.2, 3.4, 1.4, 6.5};
        bubbleSort(numArray);
    }
}