public class Problem3 {
    public static boolean checkAscendingOrder(int[] nums) {
        int out = nums[0];
        for (int i = 0; i < nums.length - 1; i++) {
            if (nums[i + 1] >= out) {
                out = nums[i + 1];
            } else {
                return false;            
            }
        }
        return true;
    }

    public static void main(String[] args) {
        int[] arr = new int[] {1, 2, 3, 4, 5};
        System.out.println(checkAscendingOrder(arr));

        int[] arr2 = new int[] {5, 4, 3, 2, 1};
        System.out.println(checkAscendingOrder(arr2));

        int[] arr3 = new int[] {1, 1, 1, 1, 1};
        System.out.println(checkAscendingOrder(arr3));
    }
}
