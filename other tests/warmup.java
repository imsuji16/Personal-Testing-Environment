public class warmup {
    public static int maxArray(int[] nums) {
        int out = nums[0];
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > out) {
                out = nums[i];
            }
        }
        return out;
    }
    public static void bubbleSort(int[] nums) {
        int numSorted = 0;
        while (numSorted < nums.length) {
            for (int i = 0; i < nums.length - 1; i++) {
                int n1 = nums[i];
                int n2 = nums[i + 1];
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
        int [] arr = new int [5];
        arr[0] = 5;
        arr[1] = 4;
        arr[2] = 3;
        arr[3] = 2;
        arr[4] = 1;
        System.out.println(maxArray(arr));
        bubbleSort(arr);
    }
}