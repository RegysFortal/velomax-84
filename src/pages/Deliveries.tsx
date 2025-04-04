
  const [formData, setFormData] = useState<Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>>({
    clientId: '',
    deliveryDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryTime: format(new Date(), 'HH:mm'),
    receiver: '',
    weight: 0,
    packages: 1, // Adding default packages property
    deliveryType: 'standard',
    cargoType: 'standard',
    cargoValue: 0,
    notes: '',
    minuteNumber: '',
    totalFreight: 0,
    customPricing: false,
    discount: 0,
  });
