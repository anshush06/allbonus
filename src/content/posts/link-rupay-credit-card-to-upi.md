---
title: "Link RuPay Credit Card to UPI on Google Pay and Paytm"
description: "How to link a RuPay credit card to UPI on Google Pay and Paytm, what it can pay for (merchants only, no transfers) and why linking fails."
date: 2026-11-05
related_apps:
  - paytm
  - google-pay
published: true
---

Yes, you can link a RuPay credit card to UPI on Google Pay and Paytm if your bank supports it, but only to pay merchants, never to send money to people.

Say you're at a supermarket and would rather put the bill on your credit card than your bank balance. Scan the shop's QR, pick the card, enter its UPI PIN, done. That works on business QR codes. Many small vendors use a personal QR, and the card won't work there.

## Which cards and banks work?

Among credit cards, only **RuPay** can be linked. The bank also has to switch the card on for UPI. If the card is new and doesn't show up, Google Pay suggests waiting 48 hours and trying again.

There is no single bank list that stays correct, so don't trust old blog posts. The quickest test is to start the linking steps below. If your bank isn't shown, it isn't supported yet.

## How do I link a RuPay credit card on Google Pay?

1. Open Google Pay and tap your **profile picture** (top right).
2. Tap **Add RuPay credit card**.
3. Choose the **issuing bank**, then the card if you have more than one.
4. Verify with your **card details**, or with the **first 6 digits of your Aadhaar** if that option appears.
5. Create a **UPI PIN for the card**, or enter it if you already set one for this card in another app.

Before you start, check that **outgoing SMS works** and that the **SIM in your phone has the same number your bank has for the card**. Google Pay may send several verification SMSes, each charged at your normal rate.

## How do I link it on Paytm?

1. Open Paytm and tap your **profile icon** (top left).
2. Go to **UPI & Payment Settings**.
3. Tap **Add Credit Card** (some versions say **Add Credit Line**).
4. Pick your **card's bank**. If your mobile number is registered with the card, the details are fetched automatically.
5. Confirm the card details and **set a UPI PIN** for the card.

Use the latest version of the app.

## Is the UPI PIN the same as my card PIN?

No. The card gets its own UPI PIN, which you set with the card details while linking. It doesn't have to match the card's ATM PIN or your bank account's UPI PIN. Never share it with anyone: you enter a UPI PIN only to pay, never to receive money.

## What can I pay for with a RuPay credit card on UPI?

| Works | Doesn't work |
|---|---|
| Scanning a **merchant QR** at a shop | Sending money to **friends and family** |
| Paying merchants **online** | **Self-transfers** to your savings account |
| | Small vendors whose QR is a **personal** UPI ID |
| | Cash withdrawal, card-to-card payments |
| | Stock market investments (per Google Pay's help page) |

NPCI's rules block P2P, P2PM (small sellers using a personal UPI QR), cash withdrawal at merchants and card-to-card payments on this route. Google Pay also warns that **some merchants may not accept** RuPay credit card payments. When that happens, just pay from your bank account.

## Are there charges or limits?

You can spend up to the lower of your available credit limit and the UPI limits your bank applies. Some banks set a lower cap for the first 24 hours after you link the card. Your bank's app shows the exact figures.

Google Pay says some merchants charge a small fee to accept RuPay credit card payments. Paytm says a fee may apply on some merchant payments above ₹2,000. If a fee shows up before you enter your PIN, you can cancel and pay from your bank account.

It's still credit card spending. It goes on your card bill, and interest applies if you don't pay the full amount by the due date. Check your card's terms for UPI fees and reward points, which differ by bank.

## Why can't I link my RuPay credit card?

- **Your bank doesn't support RuPay credit on UPI yet.** The most common reason.
- **Different mobile numbers.** The number on your bank's card record must be the one in your phone.
- **Wrong OTP or card details.** Re-enter carefully, last 6 digits and expiry.
- **Outgoing SMS blocked.** On dual-SIM phones, set SMS to your card's SIM, not "Ask every time".
- **Visa or Mastercard.** These can't be linked to UPI. Google Pay may let you add them for tap-to-pay or bills, but that isn't UPI and won't work on a QR scan.

If the bank is the problem, only the bank can fix it. Call them and ask whether the card is enabled for UPI.

## Referral offers and credit card UPI

New-user offers on [Paytm](/payments/paytm/) and [Google Pay](/payments/google-pay/) usually specify what counts as a qualifying payment. Read the terms before you pay with a credit card, since the offer may expect a normal UPI payment from your bank account. If a reward goes missing, see [referral bonus not received](/blog/referral-bonus-not-received/).

## FAQ

**Can I link a Visa or Mastercard credit card to UPI?**
No. Among credit cards, only RuPay.

**Can I send money to a friend with the card?**
No. It is for merchant payments only.

**Do I need a new UPI PIN?**
You set or enter a UPI PIN while linking. It doesn't have to match your card PIN.

**Can I use it for UPI Lite?**
No. [UPI Lite](/blog/what-is-upi-lite/) is topped up from your bank account, not a credit card.

**Does Google Pay set the spending limit?**
No. Your available credit and your bank's UPI limits decide it.
