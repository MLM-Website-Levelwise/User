// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/AppSidebar";
// import { DashboardHeader } from "@/components/DashboardHeader";
// import React, { useState, useEffect } from "react";
// import {
//   UserPlus,
//   FileText,
//   User,
//   Package as PackageIcon,
//   CreditCard,
//   ChevronDown,
// } from "lucide-react";

// interface Package {
//   id: string;
//   name: string;
//   amount: number;
//   description: string;
// }

// interface Invoice {
//   invoiceId: string;
//   memberName: string;
//   memberId: string;
//   packageName: string;
//   amount: number;
//   pinUsed: string;
//   activationDate: string;
// }

// const SelfActivation = () => {
//   const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
//   const [availablePins, setAvailablePins] = useState<string[]>([]);
//   const [invoice, setInvoice] = useState<Invoice | null>(null);

//   // Current user data
//   const currentUser = {
//     id: "PRN676277",
//     name: "Samima Bibi",
//   };

//   // Package data
//   const packages: Package[] = [
//     {
//       id: "PKG001",
//       name: "Basic",
//       amount: 30.0,
//       description: "Basic activation package",
//     },
//     {
//       id: "PKG002",
//       name: "Elite",
//       amount: 45.0,
//       description: "Elite activation package",
//     },
//   ];

//   // Dummy PIN data by package
//   const packagePinsData: Record<string, string[]> = {
//     PKG001: ["ELT123456", "ELT789012", "ELT345678"],
//     PKG002: ["PRE901234", "PRE567890", "PRE123456", "PRE789012"],
//   };

//   // Initialize package and pins
//   useEffect(() => {
//     if (selectedPackage) {
//       setAvailablePins(packagePinsData[selectedPackage.id] || []);
//     } else {
//       setAvailablePins([]);
//     }
//   }, [selectedPackage]);

//   const handlePackageSelect = (packageId: string) => {
//     const pkg = packages.find((p) => p.id === packageId);
//     setSelectedPackage(pkg || null);
//     setInvoice(null);
//   };

//   const handleActivation = () => {
//     if (!selectedPackage || availablePins.length === 0) {
//       alert("Please select a package with available PINs");
//       return;
//     }

//     const usedPin = availablePins[0];
//     const newInvoice: Invoice = {
//       invoiceId: "INV" + Date.now().toString().slice(-8),
//       memberName: currentUser.name,
//       memberId: currentUser.id,
//       packageName: selectedPackage.name,
//       amount: selectedPackage.amount,
//       pinUsed: usedPin,
//       activationDate: new Date().toLocaleDateString(),
//     };

//     setAvailablePins(availablePins.slice(1));
//     setInvoice(newInvoice);
//     alert(`Successfully activated your account with ${selectedPackage.name}`);
//   };

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full bg-gray-50">
//         <AppSidebar />
//         <div className="flex-1 flex flex-col">
//           <DashboardHeader />
//           <main className="flex-1">
//             <div className="w-full min-h-full">
//               <div className="w-full bg-white shadow-lg overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
//                   <div className="flex items-center justify-between px-8 py-4">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-white bg-opacity-20 p-3 rounded-full">
//                         <UserPlus className="w-6 h-6" />
//                       </div>
//                       <div>
//                         <h1 className="text-2xl font-bold">SELF ACTIVATION</h1>
//                         <p className="text-blue-100 text-sm">
//                           Activate Your Account
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="bg-blue-100 p-2 rounded-full">
//                         <User className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <h3 className="text-xl font-bold text-gray-800">
//                         Your Account Details
//                       </h3>
//                     </div>

//                     <div className="space-y-5">
//                       {/* Your Account Info */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Your ID
//                           </label>
//                           <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
//                             <User className="w-5 h-5 text-gray-500" />
//                             <p className="font-medium text-gray-800">
//                               {currentUser.id}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Your Name
//                           </label>
//                           <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
//                             <User className="w-5 h-5 text-gray-500" />
//                             <p className="font-medium text-gray-800">
//                               {currentUser.name}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Package Selection + PINs */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Activation Package
//                           </label>
//                           <div className="relative">
//                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                               <PackageIcon className="w-5 h-5 text-gray-400" />
//                             </div>
//                             <select
//                               value={selectedPackage?.id || ""}
//                               onChange={(e) =>
//                                 handlePackageSelect(e.target.value)
//                               }
//                               className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
//                             >
//                               <option value="">Select a package</option>
//                               {packages.map((pkg) => (
//                                 <option key={pkg.id} value={pkg.id}>
//                                   {pkg.name} - ${pkg.amount.toFixed(2)}
//                                 </option>
//                               ))}
//                             </select>
//                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                               <ChevronDown className="w-5 h-5 text-gray-400" />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Available PINs
//                           </label>
//                           <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
//                             <CreditCard className="w-5 h-5 text-blue-500" />
//                             <p className="font-medium text-blue-800">
//                               {availablePins.length} available
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Activate Button */}
//                   <div className="text-center mb-6">
//                     <button
//                       onClick={handleActivation}
//                       disabled={!selectedPackage || availablePins.length === 0}
//                       className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg mx-auto"
//                     >
//                       <UserPlus className="w-5 h-5" />
//                       ACTIVATE ACCOUNT
//                     </button>
//                   </div>

//                   {/* Invoice Display */}
//                   {invoice && (
//                     <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-xl">
//                       <div className="text-center mb-6">
//                         <div className="flex items-center justify-center gap-3 mb-2">
//                           <FileText className="w-8 h-8 text-blue-600" />
//                           <h2 className="text-3xl font-bold text-gray-800">
//                             ACTIVATION INVOICE
//                           </h2>
//                         </div>
//                         <div className="text-blue-600 font-semibold">
//                           Invoice ID: {invoice.invoiceId}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div>
//                           <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
//                             Account Information
//                           </h3>
//                           <div className="space-y-3">
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 Name:
//                               </span>
//                               <span className="font-bold">
//                                 {invoice.memberName}
//                               </span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 ID:
//                               </span>
//                               <span className="font-bold">
//                                 {invoice.memberId}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <div>
//                           <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
//                             Package Details
//                           </h3>
//                           <div className="space-y-3">
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 Package:
//                               </span>
//                               <span className="font-bold">
//                                 {invoice.packageName}
//                               </span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 PIN Used:
//                               </span>
//                               <span className="font-mono font-bold text-green-600">
//                                 {invoice.pinUsed}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mt-8 pt-6 border-t-2 border-gray-200">
//                         <div className="flex justify-between items-center">
//                           <span className="text-2xl font-bold text-gray-800">
//                             Total Amount Paid:
//                           </span>
//                           <span className="text-4xl font-bold text-green-600">
//                             ₹{invoice.amount.toFixed(2)}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
//                         <div className="text-lg font-bold text-green-700 mb-1">
//                           🎉 ACTIVATION SUCCESSFUL! 🎉
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           Your account has been successfully activated!
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default SelfActivation;

// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/AppSidebar";
// import { DashboardHeader } from "@/components/DashboardHeader";
// import React, { useState, useEffect } from "react";
// import {
//   UserPlus,
//   FileText,
//   User,
//   Package as PackageIcon,
//   Wallet,
//   ChevronDown,
// } from "lucide-react";

// interface Package {
//   id: string;
//   name: string;
//   amount: number;
//   description: string;
// }

// interface Invoice {
//   invoiceId: string;
//   memberName: string;
//   memberId: string;
//   packageName: string;
//   amount: number;
//   activationDate: string;
//   remainingBalance: number;
// }

// const SelfActivation = () => {
//   const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
//   const [walletBalance, setWalletBalance] = useState<number>(500.0); // Initial wallet balance
//   const [invoice, setInvoice] = useState<Invoice | null>(null);

//   // Current user data
//   const currentUser = {
//     id: "PRN676277",
//     name: "Samima Bibi",
//   };

//   // Package data
//   const packages: Package[] = [
//     {
//       id: "PKG001",
//       name: "Basic",
//       amount: 30.0,
//       description: "Basic activation package",
//     },
//     {
//       id: "PKG002",
//       name: "Elite",
//       amount: 45.0,
//       description: "Elite activation package",
//     },
//   ];

//   const handlePackageSelect = (packageId: string) => {
//     const pkg = packages.find((p) => p.id === packageId);
//     setSelectedPackage(pkg || null);
//     setInvoice(null);
//   };

//   const handleActivation = () => {
//     if (!selectedPackage) {
//       alert("Please select a package");
//       return;
//     }

//     if (walletBalance < selectedPackage.amount) {
//       alert("Insufficient funds in your wallet");
//       return;
//     }

//     const newBalance = walletBalance - selectedPackage.amount;

//     const newInvoice: Invoice = {
//       invoiceId: "INV" + Date.now().toString().slice(-8),
//       memberName: currentUser.name,
//       memberId: currentUser.id,
//       packageName: selectedPackage.name,
//       amount: selectedPackage.amount,
//       activationDate: new Date().toLocaleDateString(),
//       remainingBalance: newBalance,
//     };

//     setWalletBalance(newBalance);
//     setInvoice(newInvoice);
//     alert(`Successfully activated your account with ${selectedPackage.name}`);
//   };

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full bg-gray-50">
//         <AppSidebar />
//         <div className="flex-1 flex flex-col">
//           <DashboardHeader />
//           <main className="flex-1">
//             <div className="w-full min-h-full">
//               <div className="w-full bg-white shadow-lg overflow-hidden">
//                 {/* <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
//                   <div className="flex items-center justify-between px-8 py-4">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-white bg-opacity-20 p-3 rounded-full">
//                         <UserPlus className="w-6 h-6" />
//                       </div>
//                       <div>
//                         <h1 className="text-2xl font-bold">SELF ACTIVATION</h1>
//                         <p className="text-blue-100 text-sm">
//                           Activate Your Account
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 bg-white bg-opacity-20 px-4 py-2 rounded-full">
//                       <Wallet className="w-5 h-5" />
//                       <div>
//                         <p className="text-xs text-blue-100">Main Wallet</p>
//                         <p className="font-bold">${walletBalance.toFixed(2)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div> */}
//                 <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
//                   <div className="px-8 py-6">
//                     <div className="flex items-center justify-between">
//                       {/* Left Side - Self Activation Title */}
//                       <div className="flex items-center gap-4">
//                         <div className="bg-white bg-opacity-20 p-3 rounded-full flex items-center justify-center">
//                           <UserPlus className="w-6 h-6" />
//                         </div>
//                         <div>
//                           <h1 className="text-2xl font-bold tracking-tight">
//                             SELF ACTIVATION
//                           </h1>
//                           <p className="text-blue-100 text-sm opacity-90">
//                             Activate your account using your wallet balance
//                           </p>
//                         </div>
//                       </div>

//                       {/* Right Side - Wallet Balance */}
//                       <div className="flex items-center gap-4">
//                         <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 shadow-lg">
//                           <div className="flex items-center gap-3">
//                             <div className="bg-white bg-opacity-20 p-2 rounded-full">
//                               <Wallet className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                               <p className="text-xs font-medium text-blue-100 opacity-90">
//                                 MAIN WALLET BALANCE
//                               </p>
//                               <p className="text-xl font-bold tracking-wide">
//                                 ${walletBalance.toFixed(2)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="bg-blue-100 p-2 rounded-full">
//                         <User className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <h3 className="text-xl font-bold text-gray-800">
//                         Your Account Details
//                       </h3>
//                     </div>

//                     <div className="space-y-5">
//                       {/* Your Account Info */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Your ID
//                           </label>
//                           <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
//                             <User className="w-5 h-5 text-gray-500" />
//                             <p className="font-medium text-gray-800">
//                               {currentUser.id}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Your Name
//                           </label>
//                           <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
//                             <User className="w-5 h-5 text-gray-500" />
//                             <p className="font-medium text-gray-800">
//                               {currentUser.name}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Package Selection */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Activation Package
//                           </label>
//                           <div className="relative">
//                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                               <PackageIcon className="w-5 h-5 text-gray-400" />
//                             </div>
//                             <select
//                               value={selectedPackage?.id || ""}
//                               onChange={(e) =>
//                                 handlePackageSelect(e.target.value)
//                               }
//                               className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
//                             >
//                               <option value="">Select a package</option>
//                               {packages.map((pkg) => (
//                                 <option key={pkg.id} value={pkg.id}>
//                                   {pkg.name} - ${pkg.amount.toFixed(2)}
//                                 </option>
//                               ))}
//                             </select>
//                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                               <ChevronDown className="w-5 h-5 text-gray-400" />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="space-y-1">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Wallet Balance After Activation
//                           </label>
//                           <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
//                             <Wallet className="w-5 h-5 text-blue-500" />
//                             <p className="font-medium text-blue-800">
//                               $
//                               {selectedPackage
//                                 ? (
//                                     walletBalance - selectedPackage.amount
//                                   ).toFixed(2)
//                                 : walletBalance.toFixed(2)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Activate Button */}
//                   <div className="text-center mb-6">
//                     <button
//                       onClick={handleActivation}
//                       disabled={
//                         !selectedPackage ||
//                         walletBalance < selectedPackage.amount
//                       }
//                       className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg mx-auto"
//                     >
//                       <UserPlus className="w-5 h-5" />
//                       ACTIVATE ACCOUNT
//                     </button>
//                   </div>

//                   {/* Invoice Display */}
//                   {invoice && (
//                     <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-xl">
//                       <div className="text-center mb-6">
//                         <div className="flex items-center justify-center gap-3 mb-2">
//                           <FileText className="w-8 h-8 text-blue-600" />
//                           <h2 className="text-3xl font-bold text-gray-800">
//                             ACTIVATION INVOICE
//                           </h2>
//                         </div>
//                         <div className="text-blue-600 font-semibold">
//                           Invoice ID: {invoice.invoiceId}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div>
//                           <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
//                             Account Information
//                           </h3>
//                           <div className="space-y-3">
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 Name:
//                               </span>
//                               <span className="font-bold">
//                                 {invoice.memberName}
//                               </span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 ID:
//                               </span>
//                               <span className="font-bold">
//                                 {invoice.memberId}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <div>
//                           <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
//                             Package Details
//                           </h3>
//                           <div className="space-y-3">
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 Package:
//                               </span>
//                               <span className="font-bold">
//                                 {invoice.packageName}
//                               </span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="font-medium text-gray-600">
//                                 Amount Paid:
//                               </span>
//                               <span className="font-bold text-green-600">
//                                 ${invoice.amount.toFixed(2)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mt-8 pt-6 border-t-2 border-gray-200">
//                         <div className="flex justify-between items-center">
//                           <span className="text-2xl font-bold text-gray-800">
//                             Remaining Wallet Balance:
//                           </span>
//                           <span className="text-4xl font-bold text-green-600">
//                             ${invoice.remainingBalance.toFixed(2)}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
//                         <div className="text-lg font-bold text-green-700 mb-1">
//                           🎉 ACTIVATION SUCCESSFUL! 🎉
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           Your account has been successfully activated!
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default SelfActivation;

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import {
  UserPlus,
  FileText,
  User,
  Package as PackageIcon,
  Wallet,
  ChevronDown,
  Gift,
  PieChart,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  amount: number;
  description: string;
  type: "shopping" | "tour";
}

interface Invoice {
  invoiceId: string;
  memberName: string;
  memberId: string;
  topUpBy: string;
  planType: "growth" | "profit-sharing";
  packageName?: string;
  amount: number;
  activationDate: string;
  remainingBalance: number;
}

type PlanType = "growth" | "profit-sharing";

const SelfActivation = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [profitSharingAmount, setProfitSharingAmount] = useState<number>(75);
  const [walletBalance, setWalletBalance] = useState<number>(5000.0);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Current user data
  const currentUser = {
    id: "PRN676277",
    name: "Samima Bibi",
  };

  // Package data for Growth Plan
  const growthPackages: Package[] = [
    {
      id: "PKG001",
      name: "Shopping Wallet Package",
      amount: 30.0,
      description: "Basic shopping wallet package",
      type: "shopping",
    },
    {
      id: "PKG002",
      name: "Tour Package",
      amount: 45.0,
      description: "Elite tour package",
      type: "tour",
    },
  ];

  // Profit Sharing amount options (multiples of 75 up to 4500)
  const profitSharingAmounts = Array.from(
    { length: 60 },
    (_, i) => (i + 1) * 75
  );

  // Reset package when plan changes
  useEffect(() => {
    setSelectedPackage(null);
    setInvoice(null);
  }, [selectedPlan]);

  const handlePackageSelect = (packageId: string) => {
    const pkg = growthPackages.find((p) => p.id === packageId) || null;
    setSelectedPackage(pkg);
  };

  const handleActivation = () => {
    if (!selectedPlan) {
      alert("Please select a plan type");
      return;
    }

    let amount = 0;
    if (selectedPlan === "growth" && selectedPackage) {
      amount = selectedPackage.amount;
    } else if (selectedPlan === "profit-sharing") {
      amount = profitSharingAmount;
    }

    if (walletBalance < amount) {
      alert("Insufficient funds in your wallet");
      return;
    }

    const newBalance = walletBalance - amount;

    const newInvoice: Invoice = {
      invoiceId: "INV" + Date.now().toString().slice(-8),
      memberName: currentUser.name,
      memberId: currentUser.id,
      topUpBy: `${currentUser.name} (${currentUser.id})`,
      planType: selectedPlan,
      amount,
      activationDate: new Date().toLocaleDateString(),
      remainingBalance: newBalance,
    };

    if (selectedPlan === "growth" && selectedPackage) {
      newInvoice.packageName = selectedPackage.name;
    }

    setWalletBalance(newBalance);
    setInvoice(newInvoice);
    alert(
      `Successfully activated ${
        selectedPlan === "growth" ? "package" : "profit-sharing"
      } for your account`
    );
  };

  const getActivationAmount = () => {
    if (selectedPlan === "growth" && selectedPackage) {
      return selectedPackage.amount;
    } else if (selectedPlan === "profit-sharing") {
      return profitSharingAmount;
    }
    return 0;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1">
            <div className="w-full min-h-full">
              <div className="w-full bg-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
                  <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full flex items-center justify-center">
                          <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight">
                            SELF ACTIVATION
                          </h1>
                          <p className="text-blue-100 text-sm opacity-90">
                            Activate your account using your wallet balance
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-full">
                              <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-100 opacity-90">
                                MAIN WALLET BALANCE
                              </p>
                              <p className="text-xl font-bold tracking-wide">
                                ${walletBalance.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Your Account Details
                      </h3>
                    </div>

                    <div className="space-y-5">
                      {/* Your Account Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Your ID
                          </label>
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                            <User className="w-5 h-5 text-gray-500" />
                            <p className="font-medium text-gray-800">
                              {currentUser.id}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Your Name
                          </label>
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                            <User className="w-5 h-5 text-gray-500" />
                            <p className="font-medium text-gray-800">
                              {currentUser.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Plan Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Plan
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              {selectedPlan === "growth" ? (
                                <Gift className="w-5 h-5 text-gray-400" />
                              ) : (
                                <PieChart className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <select
                              value={selectedPlan || ""}
                              onChange={(e) =>
                                setSelectedPlan(e.target.value as PlanType)
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                            >
                              <option value="">Select a plan</option>
                              <option value="growth">Growth Package</option>
                              <option value="profit-sharing">
                                Profit Sharing Package
                              </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Wallet After Activation
                          </label>
                          <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                            <Wallet className="w-5 h-5 text-blue-500" />
                            <p className="font-medium text-blue-800">
                              $
                              {(walletBalance - getActivationAmount()).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Conditional Fields */}
                      {selectedPlan === "growth" && (
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Activation Package
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <PackageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <select
                              value={selectedPackage?.id || ""}
                              onChange={(e) =>
                                handlePackageSelect(e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                            >
                              <option value="">Select a package</option>
                              {growthPackages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} - ${pkg.amount.toFixed(2)}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPlan === "profit-sharing" && (
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Investment Amount (Multiples of $75)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Wallet className="w-5 h-5 text-gray-400" />
                            </div>
                            <select
                              value={profitSharingAmount}
                              onChange={(e) =>
                                setProfitSharingAmount(Number(e.target.value))
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                            >
                              {profitSharingAmounts.map((amount) => (
                                <option key={amount} value={amount}>
                                  ${amount.toFixed(2)}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activate Button */}
                  <div className="text-center mb-6">
                    <button
                      onClick={handleActivation}
                      disabled={
                        !selectedPlan ||
                        (selectedPlan === "growth" && !selectedPackage) ||
                        walletBalance < getActivationAmount()
                      }
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg mx-auto"
                    >
                      <UserPlus className="w-5 h-5" />
                      ACTIVATE ACCOUNT
                    </button>
                  </div>

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
                            Account Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Name:
                              </span>
                              <span className="font-bold">
                                {invoice.memberName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                ID:
                              </span>
                              <span className="font-bold">
                                {invoice.memberId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Top Up By:
                              </span>
                              <span className="font-bold">
                                {invoice.topUpBy}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                            {invoice.planType === "growth"
                              ? "Package Details"
                              : "Investment Details"}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Plan Type:
                              </span>
                              <span className="font-bold">
                                {invoice.planType === "growth"
                                  ? "Growth Package"
                                  : "Profit Sharing"}
                              </span>
                            </div>
                            {invoice.planType === "growth" &&
                              invoice.packageName && (
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600">
                                    Package:
                                  </span>
                                  <span className="font-bold">
                                    {invoice.packageName}
                                  </span>
                                </div>
                              )}
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Amount:
                              </span>
                              <span className="font-bold text-green-600">
                                ${invoice.amount.toFixed(2)}
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
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t-2 border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-800">
                            Remaining Wallet Balance:
                          </span>
                          <span className="text-4xl font-bold text-green-600">
                            ${invoice.remainingBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                        <div className="text-lg font-bold text-green-700 mb-1">
                          🎉{" "}
                          {invoice.planType === "growth"
                            ? "PACKAGE"
                            : "INVESTMENT"}{" "}
                          ACTIVATION SUCCESSFUL! 🎉
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.planType === "growth"
                            ? "Your package has been successfully activated!"
                            : "Your investment has been successfully processed!"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SelfActivation;
