import React, { useState } from 'react';
import { MapPin, Users, Calendar, DollarSign, ArrowRight, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const GroupManager: React.FC = () => {
  const { groups, selectedGroup, setSelectedGroup } = useApp();
  const { user } = useAuth();
  const [searchPincode, setSearchPincode] = useState('');

  const filteredGroups = groups.filter(group => {
    if (searchPincode) {
      return group.pincode.includes(searchPincode) || group.area.toLowerCase().includes(searchPincode.toLowerCase());
    }
    return group.pincode === user?.pincode || group.area.toLowerCase().includes(user?.pincode.slice(0, 3) || '');
  });

  const handleJoinGroup = (group: any) => {
    if (group.status === 'full') {
      toast.error('This group is already full');
      return;
    }
    
    setSelectedGroup(group);
    toast.success(`Joined ${group.name} successfully!`);
  };

  const handleLeaveGroup = () => {
    setSelectedGroup(null);
    toast.success('Left the group');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Buying Groups</h1>
        {selectedGroup && (
          <button
            onClick={handleLeaveGroup}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Leave Current Group
          </button>
        )}
      </div>

      {/* Current Group */}
      {selectedGroup && (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Current Group</h2>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              Active Member
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{selectedGroup.name}</h3>
              <p className="text-green-100">{selectedGroup.area}</p>
            </div>
            <div className="space-y-1">
              <p className="text-green-100">Members: {selectedGroup.currentMembers}/{selectedGroup.maxMembers}</p>
              <p className="text-green-100">Min Order: ₹{selectedGroup.minOrderValue}</p>
            </div>
            <div className="space-y-1">
              <p className="text-green-100">Delivery Day: {selectedGroup.deliveryDay}</p>
              <p className="text-green-100">Status: {selectedGroup.status}</p>
            </div>
          </div>
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full" 
              style={{ width: `${(selectedGroup.currentMembers / selectedGroup.maxMembers) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by pincode or area..."
          value={searchPincode}
          onChange={(e) => setSearchPincode(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Available Groups */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedGroup ? 'Other Groups' : 'Available Groups'}
        </h2>
        
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg mb-2">No groups found</p>
            <p className="text-gray-400">Try searching for groups in nearby areas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <div key={group.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}>
                    {group.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{group.area}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{group.currentMembers}/{group.maxMembers} members</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Delivery: {group.deliveryDay}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Min Order: ₹{group.minOrderValue}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Group Capacity</span>
                    <span>{group.currentMembers}/{group.maxMembers}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        group.status === 'full' ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${(group.currentMembers / group.maxMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinGroup(group)}
                  disabled={group.status === 'full' || selectedGroup?.id === group.id}
                  className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    group.status === 'full' || selectedGroup?.id === group.id
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  <span>
                    {selectedGroup?.id === group.id 
                      ? 'Current Group' 
                      : group.status === 'full' 
                        ? 'Group Full' 
                        : 'Join Group'
                    }
                  </span>
                  {group.status !== 'full' && selectedGroup?.id !== group.id && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group CTA */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Don't see a group in your area?</h3>
        <p className="text-gray-600 mb-4">Start your own buying group and invite other vendors</p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Create New Group
        </button>
      </div>
    </div>
  );
};

export default GroupManager;