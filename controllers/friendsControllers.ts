import { Request, Response } from "express";
import FriendRequest, { IFriendRequest } from "../models/FriendRequest";

// Send a friend request
const FriendRequestController = () => {
  const SendRequest = async (req: Request, res: Response) => {
    const { requesterId, recipientId } = req.body;

    const newFriendRequest: IFriendRequest = new FriendRequest({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    try {
      const savedRequest = await newFriendRequest.save();
      res
        .status(201)
        .json({ message: "Friend request sent", data: savedRequest });
    } catch (error) {
      res.status(500).json({ message: "Error sending friend request", error });
    }
  };
  // Accept a friend request
  const AcceptRequest = async (req: Request, res: Response) => {
    const { requestId } = req.body;

    try {
      const friendRequest = await FriendRequest.findById(requestId);
      if (!friendRequest) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      friendRequest.status = "accepted";
      await friendRequest.save();

      res
        .status(200)
        .json({ message: "Friend request accepted", data: friendRequest });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error accepting friend request", error });
    }
  };
  const RejectRequest = async (req: Request, res: Response) => {
    const { requestId } = req.body;

    try {
      const friendRequest = await FriendRequest.findById(requestId);
      if (!friendRequest) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      friendRequest.status = "rejected";
      await friendRequest.save();

      res
        .status(200)
        .json({ message: "Friend request rejected", data: friendRequest });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error rejecting friend request", error });
    }
  };
  // Get accepted friends
  const GetAllFriends = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const acceptedFriends = await FriendRequest.find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: "accepted",
      })
        .populate("requester", "username email")
        .populate("recipient", "username email");

      res.status(200).json({ friends: acceptedFriends });
    } catch (error) {
      res.status(500).json({ message: "Error fetching friends", error });
    }
  };
  // Get pending friend requests
  const GetPendingFriends = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const pendingRequests = await FriendRequest.find({
        recipient: userId,
        status: "pending",
      }).populate("requester", "username email");

      res.status(200).json({ requests: pendingRequests });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching friend requests", error });
    }
  };

  return {
    SendRequest,
    AcceptRequest,
    RejectRequest,
    GetAllFriends,
    GetPendingFriends,
  };
};
export default FriendRequestController;
