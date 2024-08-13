"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FriendRequest_1 = __importDefault(require("../models/FriendRequest"));
// Send a friend request
const FriendRequestController = () => {
    const SendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { requesterId, recipientId } = req.body;
        const newFriendRequest = new FriendRequest_1.default({
            requester: requesterId,
            recipient: recipientId,
            status: "pending",
        });
        try {
            const savedRequest = yield newFriendRequest.save();
            res
                .status(201)
                .json({ message: "Friend request sent", data: savedRequest });
        }
        catch (error) {
            res.status(500).json({ message: "Error sending friend request", error });
        }
    });
    // Accept a friend request
    const AcceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { requestId } = req.body;
        try {
            const friendRequest = yield FriendRequest_1.default.findById(requestId);
            if (!friendRequest) {
                return res.status(404).json({ message: "Friend request not found" });
            }
            friendRequest.status = "accepted";
            yield friendRequest.save();
            res
                .status(200)
                .json({ message: "Friend request accepted", data: friendRequest });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error accepting friend request", error });
        }
    });
    const RejectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { requestId } = req.body;
        try {
            const friendRequest = yield FriendRequest_1.default.findById(requestId);
            if (!friendRequest) {
                return res.status(404).json({ message: "Friend request not found" });
            }
            friendRequest.status = "rejected";
            yield friendRequest.save();
            res
                .status(200)
                .json({ message: "Friend request rejected", data: friendRequest });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error rejecting friend request", error });
        }
    });
    // Get accepted friends
    const GetAllFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const acceptedFriends = yield FriendRequest_1.default.find({
                $or: [{ requester: userId }, { recipient: userId }],
                status: "accepted",
            })
                .populate("requester", "username email")
                .populate("recipient", "username email");
            res.status(200).json({ friends: acceptedFriends });
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching friends", error });
        }
    });
    // Get pending friend requests
    const GetPendingFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const pendingRequests = yield FriendRequest_1.default.find({
                recipient: userId,
                status: "pending",
            }).populate("requester", "username email");
            res.status(200).json({ requests: pendingRequests });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error fetching friend requests", error });
        }
    });
    return {
        SendRequest,
        AcceptRequest,
        RejectRequest,
        GetAllFriends,
        GetPendingFriends,
    };
};
exports.default = FriendRequestController;
