import React, { useState, useEffect } from "react";
import {
  Edit,
  Package,
  CreditCard,
  User,
  UserPlus,
  FileText,
  Users,
  Shield,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  amount: number;
  description: string;
}

interface Member {
  id: string;
  name: string;
  status: "active" | "inactive";
}

interface PackagePin {
  packageId: string;
  pins: string[];
}

interface Invoice {
  invoiceId: string;
  memberName: string;
  memberId: string;
  sponsorName?: string;
  sponsorId?: string;
  packageName: string;
  amount: number;
  pinUsed: string;
  activationDate: string;
  activationType: "self" | "member";
}

interface IdActivationBaseProps {
  activationType: "self" | "member";
  currentUser: {
    id: string;
    name: string;
  };
  onActivationTypeChange?: (type: "self" | "member") => void;
}

const IdActivationBase: React.FC<IdActivationBaseProps> = ({
  activationType,
  currentUser,
  onActivationTypeChange,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packagePins, setPackagePins] = useState<PackagePin[]>([]);
  const [memberId, setMemberId] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [sponsorId, setSponsorId] = useState<string>("");
  const [sponsorName, setSponsorName] = useState<string>("");
  const [isLoadingMember, setIsLoadingMember] = useState<boolean>(false);
  const [isLoadingSponsor, setIsLoadingSponsor] = useState<boolean>(false);
  const [memberError, setMemberError] = useState<string>("");
  const [sponsorError, setSponsorError] = useState<string>("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Single package data
  const packages: Package[] = [
    {
      id: "PKG001",
      name: "Basic",
      amount: 30.0,
      description: "Basic activation package",
    },
    {
      id: "PKG002",
      name: "Elite",
      amount: 45.0,
      description: "Elite activation package",
    },
  ];

  // Dummy data for inactive members
  const inactiveMembers: Member[] = [
    { id: "MEM001", name: "John Doe", status: "inactive" },
    { id: "MEM002", name: "Jane Smith", status: "inactive" },
    { id: "MEM003", name: "Bob Johnson", status: "inactive" },
    { id: "MEM004", name: "Alice Brown", status: "inactive" },
    { id: "MEM005", name: "Charlie Wilson", status: "inactive" },
  ];

  // Dummy data for active members (sponsors)
  const activeMembers: Member[] = [
    { id: "SPR001", name: "David Miller", status: "active" },
    { id: "SPR002", name: "Sarah Connor", status: "active" },
    { id: "SPR003", name: "Mike Ross", status: "active" },
    { id: "SPR004", name: "Lisa Anderson", status: "active" },
  ];

  // Initialize with single package PINs
  useEffect(() => {
    const dummyPackagePins: PackagePin[] = [
      {
        packageId: "PKG001", // Elite Package
        pins: ["ELT123456", "ELT789012", "ELT345678", "ELT901234", "ELT567890"],
      },
    ];
    setPackagePins(dummyPackagePins);
    // Auto-select the only available package
    setSelectedPackage(packages[0]);
  }, []);

  // Get available PINs for selected package
  const getAvailablePinsForPackage = (packageId: string): string[] => {
    const packagePin = packagePins.find((pp) => pp.packageId === packageId);
    return packagePin ? packagePin.pins : [];
  };

  // Get current PIN for selected package
  const getCurrentPin = (): string => {
    if (!selectedPackage) return "";
    const availablePins = getAvailablePinsForPackage(selectedPackage.id);
    return availablePins.length > 0 ? availablePins[0] : "";
  };

  // Handle package selection from dropdown
  const handlePackageSelect = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setInvoice(null);
    }
  };

  // Simulate member name fetch
  const fetchMemberName = async (id: string) => {
    setIsLoadingMember(true);
    setMemberError("");

    setTimeout(() => {
      const member = inactiveMembers.find(
        (m) => m.id.toLowerCase() === id.toLowerCase()
      );
      if (member) {
        setMemberName(member.name);
        setMemberError("");
      } else {
        setMemberName("");
        setMemberError("Member not found or not inactive");
      }
      setIsLoadingMember(false);
    }, 500);
  };

  // Simulate sponsor name fetch
  const fetchSponsorName = async (id: string) => {
    setIsLoadingSponsor(true);
    setSponsorError("");

    setTimeout(() => {
      const sponsor = activeMembers.find(
        (m) => m.id.toLowerCase() === id.toLowerCase()
      );
      if (sponsor) {
        setSponsorName(sponsor.name);
        setSponsorError("");
      } else {
        setSponsorName("");
        setSponsorError("Sponsor not found or not active");
      }
      setIsLoadingSponsor(false);
    }, 500);
  };

  // Handle member ID input
  const handleMemberIdChange = (value: string) => {
    setMemberId(value);
    if (value.trim().length >= 3) {
      fetchMemberName(value.trim());
    } else {
      setMemberName("");
      setMemberError("");
    }
  };

  // Handle sponsor ID input
  const handleSponsorIdChange = (value: string) => {
    setSponsorId(value);
    if (value.trim().length >= 3) {
      fetchSponsorName(value.trim());
    } else {
      setSponsorName("");
      setSponsorError("");
    }
  };

  // Generate invoice ID
  const generateInvoiceId = (): string => {
    return "INV" + Date.now().toString().slice(-8);
  };

  // Handle activation
  const handleActivation = () => {
    if (!selectedPackage || !memberId || !memberName) {
      alert("Please complete all required fields before activation");
      return;
    }

    if (activationType === "member" && (!sponsorId || !sponsorName)) {
      alert("Please enter sponsor details for member activation");
      return;
    }

    const availablePins = getAvailablePinsForPackage(selectedPackage.id);
    if (availablePins.length === 0) {
      alert(
        `No PINs available for ${selectedPackage.name}. Please purchase PINs from admin.`
      );
      return;
    }

    const usedPin = availablePins[0];

    // Use the PIN and remove it from available PINs
    const updatedPackagePins = packagePins.map((pp) => {
      if (pp.packageId === selectedPackage.id) {
        return {
          ...pp,
          pins: pp.pins.slice(1),
        };
      }
      return pp;
    });

    setPackagePins(updatedPackagePins);

    // Generate invoice
    const newInvoice: Invoice = {
      invoiceId: generateInvoiceId(),
      memberName: memberName,
      memberId: memberId,
      sponsorName: activationType === "member" ? sponsorName : undefined,
      sponsorId: activationType === "member" ? sponsorId : undefined,
      packageName: selectedPackage.name,
      amount: selectedPackage.amount,
      pinUsed: usedPin,
      activationDate: new Date().toLocaleDateString(),
      activationType: activationType,
    };

    setInvoice(newInvoice);

    const activationMessage =
      activationType === "self"
        ? `Successfully activated your account with ${selectedPackage.name} using PIN: ${usedPin}`
        : `Successfully activated member ${memberName} (${memberId}) with sponsor ${sponsorName} (${sponsorId}) using ${selectedPackage.name} and PIN: ${usedPin}`;

    alert(activationMessage);
  };

  // Calculate total PINs
  const totalPins = packagePins.reduce((sum, pp) => sum + pp.pins.length, 0);

  return (
    <div className="w-full min-h-full">
      <div className="w-full bg-white shadow-lg overflow-hidden">
        {/* Combined Header with ID Activation Center and Available PINs */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
          <div className="flex items-center justify-between px-8 py-6">
            {/* Left Side - ID Activation Center */}
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <UserPlus className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">ID ACTIVATION CENTER</h1>
                <p className="text-blue-100 text-sm">
                  Activate Your MLM Business Account
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Activation Type Selection */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Choose Activation Type
            </h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="activationType"
                  value="self"
                  checked={activationType === "self"}
                  onChange={() => onActivationTypeChange?.("self")}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-700">
                    Self Activation
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="activationType"
                  value="member"
                  checked={activationType === "member"}
                  onChange={() => onActivationTypeChange?.("member")}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-700">
                    Member Activation
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Member Details Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {activationType === "self"
                ? "Your Account Details"
                : "Member Details"}
            </h3>

            {activationType === "self" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your ID
                  </label>
                  <input
                    type="text"
                    value={currentUser.id}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={currentUser.name}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Package
                  </label>
                  <select
                    value={selectedPackage?.id || ""}
                    onChange={(e) => handlePackageSelect(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Choose Package</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.amount.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Member ID
                    </label>
                    <input
                      type="text"
                      value={memberId}
                      onChange={(e) => handleMemberIdChange(e.target.value)}
                      placeholder="Enter member ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {memberError && (
                      <p className="text-sm text-red-600 mt-1">{memberError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Member Name
                    </label>
                    <input
                      type="text"
                      value={isLoadingMember ? "Loading..." : memberName || ""}
                      readOnly
                      placeholder="Member name will appear here"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isLoadingMember
                          ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                          : memberName
                          ? "bg-green-100 border-green-300 text-green-800 font-semibold"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Package
                    </label>
                    <select
                      value={selectedPackage?.id || ""}
                      onChange={(e) => handlePackageSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Choose Package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - ${pkg.amount.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sponsor ID
                    </label>
                    <input
                      type="text"
                      value={sponsorId}
                      onChange={(e) => handleSponsorIdChange(e.target.value)}
                      placeholder="Enter sponsor ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {sponsorError && (
                      <p className="text-sm text-red-600 mt-1">
                        {sponsorError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sponsor Name
                    </label>
                    <input
                      type="text"
                      value={
                        isLoadingSponsor ? "Loading..." : sponsorName || ""
                      }
                      readOnly
                      placeholder="Sponsor name will appear here"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isLoadingSponsor
                          ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                          : sponsorName
                          ? "bg-green-100 border-green-300 text-green-800 font-semibold"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Activate Button */}
          {selectedPackage && (
            <div className="text-center mb-6">
              <button
                onClick={handleActivation}
                disabled={
                  !selectedPackage ||
                  !getCurrentPin() ||
                  !memberId ||
                  !memberName ||
                  (activationType === "member" &&
                    (!sponsorId || !sponsorName)) ||
                  isLoadingMember ||
                  isLoadingSponsor
                }
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-12 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg mx-auto"
              >
                <UserPlus className="w-6 h-6" />
                ACTIVATE NOW
              </button>
            </div>
          )}

          {/* Invoice Display */}
          {invoice && (
            <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-xl">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <h2 className="text-3xl font-bold text-gray-800">
                    ACTIVATION INVOICE
                  </h2>
                </div>
                <div className="text-blue-600 font-semibold">
                  Invoice ID: {invoice.invoiceId}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                    Member Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Member Name:
                      </span>
                      <span className="font-bold">{invoice.memberName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Member ID:
                      </span>
                      <span className="font-bold">{invoice.memberId}</span>
                    </div>
                    {invoice.sponsorName && (
                      <>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Sponsor Name:
                          </span>
                          <span className="font-bold">
                            {invoice.sponsorName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Sponsor ID:
                          </span>
                          <span className="font-bold">{invoice.sponsorId}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                    Package Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Package:
                      </span>
                      <span className="font-bold">{invoice.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        PIN Used:
                      </span>
                      <span className="font-mono font-bold text-green-600">
                        {invoice.pinUsed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Activation Date:
                      </span>
                      <span className="font-bold">
                        {invoice.activationDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Activation Type:
                      </span>
                      <span className="font-bold capitalize">
                        {invoice.activationType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    Total Amount Paid:
                  </span>
                  <span className="text-4xl font-bold text-green-600">
                    ₹{invoice.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-green-700 mb-1">
                  🎉 ACTIVATION SUCCESSFUL! 🎉
                </div>
                <div className="text-sm text-gray-600">
                  Welcome to your MLM journey! Keep this invoice for your
                  records.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdActivationBase;
