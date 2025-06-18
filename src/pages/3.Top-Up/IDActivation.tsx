// import React, { useState, useEffect } from "react";
// import { Edit, Package, CreditCard, User, UserPlus } from "lucide-react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

// interface Package {
//   id: string;
//   name: string;
//   amount: number;
//   description: string;
// }

// interface Member {
//   id: string;
//   name: string;
//   status: "active" | "inactive";
// }

// interface PackagePin {
//   packageId: string;
//   pins: string[];
// }

// const Id_Activation: React.FC = () => {
//   const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
//   const [packagePins, setPackagePins] = useState<PackagePin[]>([]);
//   const [memberId, setMemberId] = useState<string>("");
//   const [memberName, setMemberName] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   // Dummy data for packages
//   const packages: Package[] = [
//     {
//       id: "PKG001",
//       name: "Basic Package",
//       amount: 500.0,
//       description: "Basic activation package",
//     },
//     {
//       id: "PKG002",
//       name: "Premium Package",
//       amount: 1000.0,
//       description: "Premium activation package",
//     },
//     // {
//     //   id: "PKG003",
//     //   name: "Gold Package",
//     //   amount: 999.0,
//     //   description: "Gold activation package",
//     // },
//     // {
//     //   id: "PKG004",
//     //   name: "Platinum Package",
//     //   amount: 1499.0,
//     //   description: "Platinum activation package",
//     // },
//   ];

//   // Dummy data for inactive members
//   const inactiveMembers: Member[] = [
//     { id: "MEM001", name: "John Doe", status: "inactive" },
//     { id: "MEM002", name: "Jane Smith", status: "inactive" },
//     { id: "MEM003", name: "Bob Johnson", status: "inactive" },
//     { id: "MEM004", name: "Alice Brown", status: "inactive" },
//     { id: "MEM005", name: "Charlie Wilson", status: "inactive" },
//   ];

//   // Initialize with package-specific PINs (simulating user's purchased PINs)
//   useEffect(() => {
//     const dummyPackagePins: PackagePin[] = [
//       {
//         packageId: "PKG001", // Basic Package
//         pins: ["BAS123456", "BAS789012"],
//       },
//       {
//         packageId: "PKG002", // Premium Package
//         pins: ["PRM345678", "PRM901234", "PRM567890"],
//       },
//       {
//         packageId: "PKG003", // Gold Package
//         pins: ["GLD111222"],
//       },
//       {
//         packageId: "PKG004", // Platinum Package
//         pins: [],
//       },
//     ];
//     setPackagePins(dummyPackagePins);
//   }, []);

//   // Get available PINs for selected package
//   const getAvailablePinsForPackage = (packageId: string): string[] => {
//     const packagePin = packagePins.find((pp) => pp.packageId === packageId);
//     return packagePin ? packagePin.pins : [];
//   };

//   // Get current PIN for selected package
//   const getCurrentPin = (): string => {
//     if (!selectedPackage) return "";
//     const availablePins = getAvailablePinsForPackage(selectedPackage.id);
//     return availablePins.length > 0 ? availablePins[0] : "";
//   };

//   // Handle package selection
//   const handlePackageSelect = (pkg: Package) => {
//     setSelectedPackage(pkg);
//     // Reset member selection when package changes
//     setMemberId("");
//     setMemberName("");
//     setError("");
//   };

//   // Simulate member name fetch
//   const fetchMemberName = async (id: string) => {
//     setIsLoading(true);
//     setError("");

//     // Simulate API delay
//     setTimeout(() => {
//       const member = inactiveMembers.find(
//         (m) => m.id.toLowerCase() === id.toLowerCase()
//       );
//       if (member) {
//         setMemberName(member.name);
//         setError("");
//       } else {
//         setMemberName("");
//         setError("Member not found or not inactive");
//       }
//       setIsLoading(false);
//     }, 500);
//   };

//   // Handle member ID input
//   const handleMemberIdChange = (value: string) => {
//     setMemberId(value);
//     if (value.trim().length >= 3) {
//       fetchMemberName(value.trim());
//     } else {
//       setMemberName("");
//       setError("");
//     }
//   };

//   // Handle activation
//   const handleActivation = () => {
//     if (!selectedPackage || !memberId || !memberName) {
//       alert("Please complete all fields before activation");
//       return;
//     }

//     const availablePins = getAvailablePinsForPackage(selectedPackage.id);
//     if (availablePins.length === 0) {
//       alert(
//         `No PINs available for ${selectedPackage.name}. Please purchase PINs from admin.`
//       );
//       return;
//     }

//     const usedPin = availablePins[0];

//     // Use the PIN and remove it from available PINs
//     const updatedPackagePins = packagePins.map((pp) => {
//       if (pp.packageId === selectedPackage.id) {
//         return {
//           ...pp,
//           pins: pp.pins.slice(1), // Remove the first PIN
//         };
//       }
//       return pp;
//     });

//     setPackagePins(updatedPackagePins);

//     alert(
//       `Successfully activated member ${memberName} (${memberId}) with ${selectedPackage.name} using PIN: ${usedPin}`
//     );

//     // Reset form after activation
//     setMemberId("");
//     setMemberName("");
//     setError("");
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-green-50 min-h-screen">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
//           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//             <UserPlus className="w-6 h-6" />
//             ID Activation
//           </h1>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* PIN Inventory Display */}
//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
//               <CreditCard className="w-4 h-4" />
//               Your PIN Inventory
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {packages.map((pkg) => {
//                 const availablePins = getAvailablePinsForPackage(pkg.id);
//                 return (
//                   <div
//                     key={pkg.id}
//                     className={`p-3 border rounded-lg ${
//                       availablePins.length > 0
//                         ? "border-green-300 bg-green-50"
//                         : "border-red-300 bg-red-50"
//                     }`}
//                   >
//                     <div className="font-medium text-gray-800 text-sm">
//                       {pkg.name}
//                     </div>
//                     <div
//                       className={`text-lg font-bold ${
//                         availablePins.length > 0
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {availablePins.length} PINs
//                     </div>
//                     {/* <div className="text-xs text-gray-500">
//                       ₹{pkg.amount.toFixed(2)} each
//                     </div> */}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Step 1: Package Selection */}
//           <div className="space-y-3">
//             <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//               <Package className="w-4 h-4" />
//               Select Package for Activation
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {packages.map((pkg) => {
//                 const availablePins = getAvailablePinsForPackage(pkg.id);
//                 const hasPin = availablePins.length > 0;
//                 return (
//                   <div
//                     key={pkg.id}
//                     onClick={() => hasPin && handlePackageSelect(pkg)}
//                     className={`p-4 border rounded-lg transition-all duration-200 ${
//                       !hasPin
//                         ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
//                         : selectedPackage?.id === pkg.id
//                         ? "border-green-500 bg-green-50 ring-2 ring-green-200 cursor-pointer"
//                         : "border-gray-300 hover:border-green-400 hover:shadow-md cursor-pointer"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-1">
//                       <div className="font-medium text-gray-800">
//                         {pkg.name}
//                       </div>
//                       {/* <div
//                         className={`text-xs px-2 py-1 rounded-full ${
//                           hasPin
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {availablePins.length} PINs
//                       </div> */}
//                     </div>
//                     <div className="text-lg font-bold text-green-600">
//                       ₹{pkg.amount.toFixed(2)}
//                     </div>
//                     {/* <div className="text-xs text-gray-500">
//                       {pkg.description}
//                     </div> */}
//                     {!hasPin && (
//                       <div className="text-xs text-red-600 mt-1 font-medium">
//                         No PINs available - Contact admin
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Step 2: Current PIN Display */}
//           {selectedPackage && (
//             <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//               {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 PIN to be Used for {selectedPackage.name}
//               </label>
//               <div className="space-y-2">
//                 <input
//                   type="text"
//                   value={getCurrentPin()}
//                   readOnly
//                   className="w-full px-4 py-3 bg-white border border-green-300 rounded-lg text-lg font-bold text-green-800 tracking-wider text-center cursor-not-allowed"
//                 />
//                 <div className="text-xs text-gray-600 text-center">
//                   {getAvailablePinsForPackage(selectedPackage.id).length - 1}{" "}
//                   more PINs available after this activation
//                 </div>
//               </div> */}
//             </div>
//           )}

//           {/* Step 3: Package Amount Display */}
//           {selectedPackage && (
//             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Package Amount
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={`₹${selectedPackage.amount.toFixed(2)}`}
//                   readOnly
//                   className="w-full px-4 py-3 bg-white border border-yellow-300 rounded-lg text-lg font-bold text-yellow-800 cursor-not-allowed"
//                 />
//                 {/* <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" /> */}
//               </div>
//             </div>
//           )}

//           {/* Step 4: Inactive Member ID */}
//           {selectedPackage && (
//             <div className="space-y-3">
//               <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Enter Inactive Member ID
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={memberId}
//                   onChange={(e) => handleMemberIdChange(e.target.value)}
//                   placeholder="Enter inactive member ID"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//                 <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               </div>
//               {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
//             </div>
//           )}

//           {/* Member Name Display */}
//           {selectedPackage && memberId && (
//             <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Member Name
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={
//                     isLoading ? "Loading..." : memberName || "Member not found"
//                   }
//                   readOnly
//                   className={`w-full px-4 py-3 border rounded-lg cursor-not-allowed ${
//                     isLoading
//                       ? "bg-yellow-100 border-yellow-300 text-yellow-800"
//                       : memberName
//                       ? "bg-white border-purple-300 text-purple-800 font-medium"
//                       : "bg-red-100 border-red-300 text-red-600"
//                   }`}
//                 />
//                 <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
//               </div>
//             </div>
//           )}

//           {/* Activate Button */}
//           <button
//             onClick={handleActivation}
//             disabled={
//               !selectedPackage ||
//               !getCurrentPin() ||
//               !memberId ||
//               !memberName ||
//               isLoading
//             }
//             className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
//           >
//             <UserPlus className="w-5 h-5" />
//             {!selectedPackage || !getCurrentPin()
//               ? "Select Package with Available PIN"
//               : "Activate Now"}
//           </button>

//           {/* Summary Card */}
//           {selectedPackage && memberName && getCurrentPin() && (
//             <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
//               <h3 className="font-semibold text-gray-800 mb-2">
//                 Activation Summary
//               </h3>
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Package:</span>
//                   <span className="font-medium">{selectedPackage.name}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Amount:</span>
//                   <span className="font-medium">
//                     ₹{selectedPackage.amount.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Member:</span>
//                   <span className="font-medium">
//                     {memberName} ({memberId})
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">PIN to be used:</span>
//                   <span className="font-mono font-bold text-blue-700">
//                     {getCurrentPin()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">
//                     Remaining PINs after activation:
//                   </span>
//                   <span className="font-medium text-orange-600">
//                     {getAvailablePinsForPackage(selectedPackage.id).length - 1}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  Edit,
  Package,
  CreditCard,
  User,
  UserPlus,
  FileText,
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
  packageName: string;
  amount: number;
  pinUsed: string;
  activationDate: string;
}

const Id_Activation: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packagePins, setPackagePins] = useState<PackagePin[]>([]);
  const [memberId, setMemberId] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Dummy data for packages
  const packages: Package[] = [
    {
      id: "PKG001",
      name: "Basic Package",
      amount: 500.0,
      description: "Basic activation package",
    },
    {
      id: "PKG002",
      name: "Premium Package",
      amount: 1000.0,
      description: "Premium activation package",
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

  // Initialize with package-specific PINs (simulating user's purchased PINs)
  useEffect(() => {
    const dummyPackagePins: PackagePin[] = [
      {
        packageId: "PKG001", // Basic Package
        pins: ["BAS123456", "BAS789012"],
      },
      {
        packageId: "PKG002", // Premium Package
        pins: ["PRM345678", "PRM901234", "PRM567890"],
      },
      {
        packageId: "PKG003", // Gold Package
        pins: ["GLD111222"],
      },
      {
        packageId: "PKG004", // Platinum Package
        pins: [],
      },
    ];
    setPackagePins(dummyPackagePins);
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

  // Handle package selection
  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    // Reset member selection when package changes
    setMemberId("");
    setMemberName("");
    setError("");
    setInvoice(null);
  };

  // Simulate member name fetch
  const fetchMemberName = async (id: string) => {
    setIsLoading(true);
    setError("");

    // Simulate API delay
    setTimeout(() => {
      const member = inactiveMembers.find(
        (m) => m.id.toLowerCase() === id.toLowerCase()
      );
      if (member) {
        setMemberName(member.name);
        setError("");
      } else {
        setMemberName("");
        setError("Member not found or not inactive");
      }
      setIsLoading(false);
    }, 500);
  };

  // Handle member ID input
  const handleMemberIdChange = (value: string) => {
    setMemberId(value);
    if (value.trim().length >= 3) {
      fetchMemberName(value.trim());
    } else {
      setMemberName("");
      setError("");
    }
  };

  // Generate invoice ID
  const generateInvoiceId = (): string => {
    return "INV" + Date.now().toString().slice(-8);
  };

  // Handle activation
  const handleActivation = () => {
    if (!selectedPackage || !memberId || !memberName) {
      alert("Please complete all fields before activation");
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
          pins: pp.pins.slice(1), // Remove the first PIN
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
      packageName: selectedPackage.name,
      amount: selectedPackage.amount,
      pinUsed: usedPin,
      activationDate: new Date().toLocaleDateString(),
    };

    setInvoice(newInvoice);

    alert(
      `Successfully activated member ${memberName} (${memberId}) with ${selectedPackage.name} using PIN: ${usedPin}`
    );

    // Reset form after activation
    setMemberId("");
    setMemberName("");
    setError("");
  };

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        {/* <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            ID Activation
          </h1>
        </div> */}
        <div
          className="bg-gradient-to-r from-green-600 to-green-700"
          style={{ padding: "10px" }}
        >
          <h3
            className="text-2xl font-bold text-white flex items-center"
            style={{ gap: "12px" }}
          >
            <UserPlus style={{ width: "25px", height: "25px" }} />
            ID Activation
          </h3>
        </div>

        <div className="p-8">
          {/* PIN Inventory Display - Horizontal Layout */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8">
            <label className="text-lg font-semibold text-gray-700 flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-4" />
              Your PIN Inventory
            </label>
            <div className="flex gap-6">
              {/* {packages.map((pkg) => {
                const availablePins = getAvailablePinsForPackage(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    className={`flex-1 p-4 border rounded-xl ${
                      availablePins.length > 0
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-2">
                      {pkg.name}
                    </div>
                    <div
                      className={`text-2xl font-bold mb-1 ${
                        availablePins.length > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {availablePins.length} PINs
                    </div>
                    {/* <div className="text-sm text-gray-500">
                      Available for activation
                    </div> 
                  </div>
                );
               })} */}
              {packages.map((pkg) => {
                const availablePins = getAvailablePinsForPackage(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    className={`flex-1 border rounded-xl ${
                      availablePins.length > 0
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                    }`}
                    style={{ padding: "10px" }} // p-4 = 16px
                  >
                    <div
                      className="font-semibold text-gray-800"
                      style={{ marginBottom: "4px" }} // mb-2 = 8px
                    >
                      {pkg.name}
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        availablePins.length > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                      style={{ marginBottom: "4px" }} // mb-1 = 4px
                    >
                      {availablePins.length} PINs
                    </div>
                    {/* <div className="text-sm text-gray-500">
        Available for activation
      </div> */}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Package Selection - Side by Side */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 flex items-center gap-3 mb-4">
              <Package className="w-6 h-6" />
              Select Package for Activation
            </label>
            <div className="flex gap-6">
              {packages.map((pkg) => {
                const availablePins = getAvailablePinsForPackage(pkg.id);
                const hasPin = availablePins.length > 0;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => hasPin && handlePackageSelect(pkg)}
                    className={`flex-1 p-4 border rounded-xl transition-all duration-200 ${
                      !hasPin
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                        : selectedPackage?.id === pkg.id
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200 cursor-pointer shadow-lg"
                        : "border-gray-300 hover:border-green-400 hover:shadow-lg cursor-pointer"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-gray-800">
                        {pkg.name}
                      </div>
                      <div
                        className={`text-sm px-2 py-1 rounded-full font-medium ${
                          hasPin
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {availablePins.length} PINs
                      </div>
                    </div>
                    <div className="text-xl font-bold text-green-600 mb-2">
                      ₹{pkg.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pkg.description}
                    </div>
                    {!hasPin && (
                      <div className="text-sm text-red-600 mt-2 font-medium">
                        No PINs available - Contact admin
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Package Amount Display - Below package selection */}
          {selectedPackage && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Selected Package Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`₹${selectedPackage.amount.toFixed(2)}`}
                  readOnly
                  className="w-full px-4 py-3 bg-white border border-yellow-300 rounded-xl text-xl font-bold text-yellow-800 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Member ID and Name - Side by Side */}
          {selectedPackage && (
            <div className="flex gap-6 mb-6">
              <div className="flex-1">
                <label className="block text-lg font-semibold text-gray-700 flex items-center gap-3 mb-3">
                  <User className="w-6 h-6" />
                  Enter Inactive Member ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => handleMemberIdChange(e.target.value)}
                    placeholder="Enter inactive member ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>

              <div className="flex-1">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Member Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={
                      isLoading
                        ? "Loading..."
                        : memberName || "Member not found"
                    }
                    readOnly
                    className={`w-full px-4 py-3 border rounded-xl cursor-not-allowed ${
                      isLoading
                        ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                        : memberName
                        ? "bg-white border-purple-300 text-purple-800 font-semibold"
                        : "bg-red-100 border-red-300 text-red-600"
                    }`}
                  />
                  <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
          )}

          {/* Summary Card */}
          {selectedPackage && memberName && getCurrentPin() && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Activation Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-semibold">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-green-600">
                    ₹{selectedPackage.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member:</span>
                  <span className="font-semibold">
                    {memberName} ({memberId})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PIN to be used:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {getCurrentPin()}
                  </span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-600">
                    Remaining PINs after activation:
                  </span>
                  <span className="font-semibold text-orange-600">
                    {getAvailablePinsForPackage(selectedPackage.id).length - 1}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Activate Button - Smaller */}
          <div className="mb-6">
            <button
              onClick={handleActivation}
              disabled={
                !selectedPackage ||
                !getCurrentPin() ||
                !memberId ||
                !memberName ||
                isLoading
              }
              className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-8 rounded-lg font-bold hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              {!selectedPackage || !getCurrentPin()
                ? "Select Package with Available PIN"
                : "Activate Now"}
            </button>
          </div>

          {/* Invoice Display */}
          {invoice && (
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Activation Invoice
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Invoice ID:
                      </span>
                      <span className="font-bold text-blue-600">
                        {invoice.invoiceId}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Member Name:
                      </span>
                      <span className="font-semibold">
                        {invoice.memberName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Member ID:
                      </span>
                      <span className="font-semibold">{invoice.memberId}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Package:
                      </span>
                      <span className="font-semibold">
                        {invoice.packageName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        PIN Used:
                      </span>
                      <span className="font-mono font-bold text-green-600">
                        {invoice.pinUsed}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Activation Date:
                      </span>
                      <span className="font-semibold">
                        {invoice.activationDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    ₹{invoice.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                Thank you for your activation! Keep this invoice for your
                records.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IdActivation = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Id_Activation />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default IdActivation;
