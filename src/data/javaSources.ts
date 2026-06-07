export const JAVA_SOURCES = {
  'Memory.java': `/**
 * Core simulator helper representing Operating System Memory Frames.
 * Used to mimic physical RAM slots.
 */
public class Memory {
    private final Integer[] frames;

    public Memory(int size) {
        this.frames = new Integer[size];
        for (int i = 0; i < size; i++) {
            this.frames[i] = null; // null represents an empty virtual slot
        }
    }

    public boolean isEmpty(int index) {
        return this.frames[index] == null;
    }

    public int size() {
        return this.frames.length;
    }

    public Integer get(int index) {
        return this.frames[index];
    }

    public void put(int index, int pageValue) {
        this.frames[index] = pageValue;
    }

    public void replace(int oldPageValue, int newPageValue) {
        int index = indexOf(oldPageValue);
        if (index != -1) {
            this.frames[index] = newPageValue;
        }
    }

    public boolean contains(int pageValue) {
        return indexOf(pageValue) != -1;
    }

    public int indexOf(int pageValue) {
        for (int i = 0; i < frames.length; i++) {
            if (frames[i] != null && frames[i] == pageValue) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < frames.length; i++) {
            if (frames[i] == null) {
                sb.append("-");
            } else {
                sb.append(frames[i]);
            }
            if (i < frames.length - 1) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}`,

  'FIFO_Algorithm.java': `import java.util.Scanner;

/**
 * First-In-First-Out OS Page Replacement simulation.
 */
public class FIFO_Algorithm {

    public static int firstInFirstOut(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;
        int clockHand = 0; // Pointer to locate oldest slot
         
        for (int ref : pageReferences) {
            if (!frames.contains(ref)) {
                if (frames.isEmpty(clockHand)) {
                    frames.put(clockHand, ref);
                } else {
                    int currentPage = frames.get(clockHand); 
                    frames.replace(currentPage, ref);
                }
                pageFaults++;
                clockHand = (clockHand + 1) % frames.size();
                System.out.println(ref + ": " + frames);
            } else { 
                System.out.println(ref + ": " + "- (HIT)");
            }
        }
        return pageFaults;
    }

    public static void main(final String[] args) {
        final Scanner stdIn = new Scanner(System.in);

        System.out.println("Enter the physical memory size (number of frames):");
        final int numFrames = stdIn.nextInt();
        stdIn.nextLine();

        System.out.println("Enter the string of page references (e.g., 7012030423):");
        final String referenceString = stdIn.nextLine();

        Memory memory = new Memory(numFrames);
        int faults = firstInFirstOut(memory, toArray(referenceString));
        System.out.printf("Paging cycle complete. Total Page Faults: %d.\\n", faults);
    }

    private static Integer[] toArray(final String referenceString) {
        final Integer[] result = new Integer[referenceString.length()];
        for(int i=0; i < referenceString.length(); i++) {
            result[i] = Character.digit(referenceString.charAt(i), 10);
        }
        return result;
    }
}`,

  'LRU_Algorithm.java': `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

/**
 * Least Recently Used (LRU) Page Replacement Simulation.
 */
public class LRU_Algorithm {

    public static int leastRecentlyUsed(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;
        List<Integer> recentHistory = new ArrayList<>(); // Tracks usage chronology order (Top = MRU)

        for (int page : pageReferences) {
            if (frames.contains(page)) {
                // Page Hit: Move page to the end of history list (Most Recently Used)
                recentHistory.remove((Integer) page);
                recentHistory.add(page);
                System.out.println(page + ": - (HIT)");
                continue;
            }

            // Page Fault
            pageFaults++;

            boolean placed = false;
            // Check for empty slots first
            for (int f = 0; f < frames.size(); f++) {
                if (frames.isEmpty(f)) {
                    frames.put(f, page);
                    recentHistory.add(page);
                    placed = true;
                    System.out.println(page + ": " + frames);
                    break;
                }
            }
            if (placed) continue;

            // Evict least-recently-used item (oldest chronological index in our history)
            int lruPage = recentHistory.get(0);
            int lruIndex = frames.indexOf(lruPage);
            frames.put(lruIndex, page);

            recentHistory.remove(0);
            recentHistory.add(page);
            System.out.println(page + ": " + frames);
        }

        return pageFaults;
    }

    public static void main(final String[] args) {
        final Scanner stdIn = new Scanner(System.in);

        System.out.println("Enter the physical memory size:");
        final int numFrames = stdIn.nextInt();
        stdIn.nextLine();

        System.out.println("Enter the string of page references:");
        final String referenceString = stdIn.nextLine();

        Memory memory = new Memory(numFrames);
        int faults = leastRecentlyUsed(memory, toArray(referenceString));
        System.out.printf("Paging cycle complete. Total Page Faults: %d.\\n", faults);
    }

    private static Integer[] toArray(final String referenceString) {
        final Integer[] result = new Integer[referenceString.length()];
        for(int i=0; i < referenceString.length(); i++) {
            result[i] = Character.digit(referenceString.charAt(i), 10);
        }
        return result;
    }
}`,

  'OPT_Algorithm.java': `import java.util.Scanner;

/**
 * Optimal Page Replacement Simulation (Belady's Theoretical Minimum).
 */
public class OPT_Algorithm {

    public static int optimal(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;

        for (int i = 0; i < pageReferences.length; i++) {
            int page = pageReferences[i];

            if (frames.contains(page)) {
                System.out.println(page + ": - (HIT)");
                continue;
            }

            // Page Fault
            pageFaults++;

            boolean added = false;
            for (int f = 0; f < frames.size(); f++) {
                if (frames.isEmpty(f)) {
                    frames.put(f, page);
                    added = true;
                    System.out.println(page + ": " + frames);
                    break;
                }
            }
            if (added) continue;

            // Evict the page that will not be accessed for the furthest duration in the future
            int frameToEvict = -1;
            int farthestAccess = -1;

            for (int f = 0; f < frames.size(); f++) {
                int currentPage = frames.get(f);
                int nextAccessIndex = Integer.MAX_VALUE; // Infinity if never accessed again

                for (int j = i + 1; j < pageReferences.length; j++) {
                    if (pageReferences[j] == currentPage) {
                        nextAccessIndex = j;
                        break;
                    }
                }

                if (nextAccessIndex > farthestAccess) {
                    farthestAccess = nextAccessIndex;
                    frameToEvict = f;
                }
            }

            frames.put(frameToEvict, page);
            System.out.println(page + ": " + frames);
        }
        return pageFaults;
    }

    public static void main(final String[] args) {
        final Scanner stdIn = new Scanner(System.in);

        System.out.println("Enter the physical memory size:");
        final int numFrames = stdIn.nextInt();
        stdIn.nextLine();

        System.out.println("Enter the string of page references:");
        final String referenceString = stdIn.nextLine();

        int faults = optimal(new Memory(numFrames), toArray(referenceString));
        System.out.printf("Total Optimal Page Faults: %d.\\n", faults);
    }

    private static Integer[] toArray(final String referenceString) {
        final Integer[] result = new Integer[referenceString.length()];
        for(int i=0; i < referenceString.length(); i++) {
            result[i] = Character.digit(referenceString.charAt(i), 10);
        }
        return result;
    }
}`,

  'ClockSecondChance_Algorithm.java': `import java.util.Scanner;

/**
 * Clock (Second Chance) Operating System Page Replacement.
 */
public class ClockSecondChance_Algorithm {

    public static int clockSecondChance(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;
        int clockHand = 0; // Circular pointer
        Integer[] referenceBits = new Integer[frames.size()]; // 1-bit hardware simulation

        for (int i = 0; i < frames.size(); i++) {
            referenceBits[i] = 0;
        }

        for (int page : pageReferences) {
            if (frames.contains(page)) {
                // Page Hit: Set reference bit to 1 (second chance guaranteed)
                referenceBits[frames.indexOf(page)] = 1;
                System.out.println(page + ": - (HIT)");
                continue;
            }

            // Page Fault
            pageFaults++;

            while (true) {
                if (frames.isEmpty(clockHand)) {
                    frames.put(clockHand, page);
                    referenceBits[clockHand] = 1;
                    clockHand = (clockHand + 1) % frames.size();
                    break;
                } else if (referenceBits[clockHand] == 0) {
                    // Evict: Since its bit is zero, it gets replaced
                    frames.put(clockHand, page);
                    referenceBits[clockHand] = 1;
                    clockHand = (clockHand + 1) % frames.size();
                    break;
                } else {
                    // Clear bit (Offer Second Chance)
                    referenceBits[clockHand] = 0;
                    clockHand = (clockHand + 1) % frames.size();
                }
            }
            
            System.out.println(page + ": " + frames);
        }

        return pageFaults;
    }

    public static void main(final String[] args) {
        final Scanner stdIn = new Scanner(System.in);

        System.out.println("Enter the physical memory size:");
        final int numFrames = stdIn.nextInt();
        stdIn.nextLine();

        System.out.println("Enter the string of page references:");
        final String referenceString = stdIn.nextLine();

        Memory memory = new Memory(numFrames);
        int faults = clockSecondChance(memory, toArray(referenceString));
        System.out.printf("Total Second-Chance Faults: %d.\\n", faults);
    }

    private static Integer[] toArray(final String referenceString) {
        final Integer[] result = new Integer[referenceString.length()];
        for(int i=0; i < referenceString.length(); i++) {
            result[i] = Character.digit(referenceString.charAt(i), 10);
        }
        return result;
    }
}`
};
