import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { calculateCommission } from "../controllers/commissionController.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("✅ endedAuctionCron() called");
    const now = new Date();
    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      commissionCalculated: false,
    });

    for (const auction of endedAuctions) {
      try {
        const commissionAmount = await calculateCommission(auction._id);
        auction.commissionCalculated = true;

        const highestBidder = await Bid.findOne({
          auctionItem: auction._id,
          amount: auction.currentBid,
        });

        const auctioneer = await User.findById(auction.createdBy);
        auctioneer.unpaidCommission = commissionAmount;

        if (highestBidder) {
          auction.highestBidder = highestBidder.bidder.id;
          await auction.save();

          const bidder = await User.findById(highestBidder.bidder.id);

          await User.findByIdAndUpdate(
            bidder._id,
            {
              $inc: {
                moneySpent: highestBidder.amount,
                auctionsWon: 1,
              },
            },
            { new: true }
          );

          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommission: commissionAmount,
              },
            },
            { new: true }
          );

          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${bidder.userName},

Please complete your payment using one of the following methods:

1. **Bank Transfer**:
- Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName}
- Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber}
- Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}

2. **UPI**:
- UPI ID: ${auctioneer.paymentMethods.upi.upiId}

3. **PhonePe**:
- PhonePe Number: ${auctioneer.paymentMethods.phonePe.phonePeNumber}

4. **Google Pay**:
- GPay Number: ${auctioneer.paymentMethods.googlePay.gpayNumber}

5. **Paytm**:
- Paytm Number: ${auctioneer.paymentMethods.paytm.paytmNumber}

6. **Card**:
- Card Number: ${auctioneer.paymentMethods.card.cardNumber}
- Expiry: ${auctioneer.paymentMethods.card.expiry}
- Name on Card: ${auctioneer.paymentMethods.card.nameOnCard}

7. **Cash on Delivery (COD)**:
- Pay 20% upfront using any above method
- Remaining 80% on delivery.
`;

          if (bidder?.email) {
            await sendEmail({ email: bidder.email, subject, message });
          }
        } else {
          await auction.save();
        }
      } catch (error) {
        console.error("❌ Error in ended auction cron:", error.message || error);
      }
    }
  });
};
