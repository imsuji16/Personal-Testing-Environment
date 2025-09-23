import random
import time
print('This is a calculator!')
time.sleep (0.5)
print('Type the symbol for arithmetic.')
sym = input('')
print('Now type the first number in your problem.')
num1 = int(input(''))
print('Type the second number in your problem.')
num2 = int(input(''))

if sym == '+':
    ans = num1 + num2
elif sym == '-':
    ans = num1 - num2
elif sym == '*':
    ans = num1 * num2
elif sym == '/':
    ans = num1 / num2x

print(f'Your answer is {ans}.')