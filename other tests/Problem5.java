public class Problem5 {
    public static int sumIndex(int[] nums, int index) {
        int out = 0;
        for (int i = 0; i < index; i++) {
            out += nums[i];
        }
        return out;
    }

    public static void main(String[] args) {
        int[] arr = new int[] {1, 2, 3, 4, 5};
        for (int i = 0; i < arr.length + 1; i++) {
            System.out.println(sumIndex(arr, i));
        }
    }
}
