# Bubble Sort
def bubbleSort(list):
    numSorted = 0
    numPasses = 0
    while numSorted != len(list) - 1:
        i = 0
        numSorted = 0
        for i in range(0, len(list) - 1):
            n1 = list[i]
            n2 = list[i + 1]
            if n2 < n1:
                list.pop(i + 1)
                list.insert(i, n2)
            else:
                numSorted += 1
        numPasses += 1
    return numPasses

# Insertion Sort
def insertionSort(list):
    i = 0
    for i in range(0, len(list) - 1):
        n1 = list[i]
        j = 0
        for j in range(0, i):
            j = 1




# Data Set
import random
data = []
for i in range (0, 99):
    data.append(random.randint(1, 100))

# Testing
copiedData = data.copy()
numPasses = bubbleSort(copiedData)
print(f"-BUBBLE SORT-\n{copiedData}\nNumber of Passes: {numPasses}\n")