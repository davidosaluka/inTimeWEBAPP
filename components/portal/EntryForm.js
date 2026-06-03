'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Spinner from './Spinner'

export default function EntryForm({ showFeeField, userRole }) {
  const supabase = createClient()

  const [vendors, setVendors] = useState([])
  const [packageDescription, setPackageDescription] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [deliveryFee, setDeliveryFee] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingVendors, setLoadingVendors] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetchVendors() {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'vendor')
        .order('full_name')
      if (data) setVendors(data)
      setLoadingVendors(false)
    }
    fetchVendors()
  }, [])

  const feeRanges = [
    '₦500 – ₦1,000',
    '₦1,000 – ₦2,000',
    '₦2,000 – ₦3,500',
    '₦3,500 – ₦5,000',
    '₦5,000 – ₦10,000',
    '₦10,000+',
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()

    const entry = {
      user_id: user.id,
      role: userRole,
      status: 'pending',
      vendor_id: vendorId,
      package_description: packageDescription,
      pickup_location: pickupLocation,
      delivery_location: deliveryLocation,
      expected_delivery_fee: showFeeField ? deliveryFee : null,
    }

    const { error } = await supabase.from('entries').insert(entry)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setPackageDescription('')
      setPickupLocation('')
      setDeliveryLocation('')
      setDeliveryFee('')
      setVendorId('')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-start justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-xl">
        <h1 className="text-gray-900 text-2xl font-bold mb-2">Log Entry</h1>
        <p className="text-gray-500 text-sm mb-8">
          {userRole === 'rider'
            ? 'Record the details of a completed delivery.'
            : 'Submit a new delivery request.'}
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-6">
            Entry submitted successfully! It has been sent to the vendor for approval.{' '}
            <a href={`/${userRole}/history`} className="underline">View status</a>.
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-1">Package Description</label>
            <textarea
              required
              value={packageDescription}
              onChange={e => setPackageDescription(e.target.value)}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
              placeholder="Describe the package..."
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium block mb-1">Pickup Location</label>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              placeholder="e.g. 12 Broad Street, Lagos Island"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium block mb-1">Delivery Location</label>
            <input
              type="text"
              required
              value={deliveryLocation}
              onChange={e => setDeliveryLocation(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              placeholder="e.g. 5 Allen Avenue, Ikeja"
            />
          </div>

          {showFeeField && (
            <div>
              <label className="text-gray-700 text-sm font-medium block mb-1">Expected Delivery Fee</label>
              <select
                required
                value={deliveryFee}
                onChange={e => setDeliveryFee(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              >
                <option value="" disabled>Select a fee range</option>
                {feeRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-gray-700 text-sm font-medium block mb-1">Assign to Vendor</label>
            {loadingVendors ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Spinner size="xs" /> Loading vendors...
              </div>
            ) : (
              <select
                required
                value={vendorId}
                onChange={e => setVendorId(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              >
                <option value="" disabled>Select a vendor</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.full_name || v.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F94C05] hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Submitting...
                </>
              ) : (
                'Submit Entry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
