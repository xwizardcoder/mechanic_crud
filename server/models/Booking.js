const fs = require('fs');
const path = require('path');

const FILE_DIR = path.join(__dirname, '../data');
const FILE_PATH = path.join(FILE_DIR, 'bookings.json');

// Ensure data folder and file exists
const initDB = () => {
  if (!fs.existsSync(FILE_DIR)) {
    fs.mkdirSync(FILE_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    const seedData = [
      {
        _id: '60c72b2f9b1d8b2c8c8b4567',
        customerName: 'Rajesh Kumar',
        customerPhone: '9876543210',
        customerEmail: 'rajesh@example.com',
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vehicleYear: 2021,
        serviceType: 'brake_repair',
        description: 'Brakes squeaking on high speed stops.',
        assignedMechanic: 'Sunita Patel',
        status: 'pending',
        priority: 'high',
        estimatedCost: 2500,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '60c72b2f9b1d8b2c8c8b4568',
        customerName: 'Priya Sharma',
        customerPhone: '9123456789',
        customerEmail: 'priya@example.com',
        vehicleMake: 'Maruti',
        vehicleModel: 'Swift',
        vehicleYear: 2018,
        serviceType: 'oil_change',
        description: 'Standard engine oil and oil filter replacement.',
        assignedMechanic: 'Priya Sharma',
        status: 'completed',
        priority: 'low',
        estimatedCost: 1500,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    fs.writeFileSync(FILE_PATH, JSON.stringify(seedData, null, 2));
  }
};

initDB();

const readData = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

const generateId = () => {
  return require('crypto').randomBytes(12).toString('hex');
};

const filterBookings = (bookings, query = {}) => {
  return bookings.filter(b => {
    // Search
    if (query.$or) {
      const match = query.$or.some(clause => {
        const field = Object.keys(clause)[0];
        const val = b[field];
        if (!val) return false;
        const regexStr = clause[field].$regex;
        return String(val).toLowerCase().includes(regexStr.toLowerCase());
      });
      if (!match) return false;
    }

    // Exact matches
    if (query.status && query.status !== 'all' && b.status !== query.status) return false;
    if (query.serviceType && query.serviceType !== 'all' && b.serviceType !== query.serviceType) return false;
    if (query.priority && query.priority !== 'all' && b.priority !== query.priority) return false;

    return true;
  });
};

class QueryBuilder {
  constructor(data) {
    this.data = data;
  }

  sort(sortOptions) {
    if (sortOptions) {
      const field = Object.keys(sortOptions)[0];
      const order = sortOptions[field];
      this.data.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'priority') {
          const priorityWeight = { low: 1, normal: 2, high: 3, urgent: 4 };
          valA = priorityWeight[valA] || 0;
          valB = priorityWeight[valB] || 0;
        } else if (field === 'createdAt' || field === 'updatedAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        } else if (typeof valA === 'string') {
          return order === 1 ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (valA < valB) return order === 1 ? -1 : 1;
        if (valA > valB) return order === 1 ? 1 : -1;
        return 0;
      });
    }
    return this;
  }

  skip(n) {
    this.data = this.data.slice(n);
    return this;
  }

  limit(n) {
    this.data = this.data.slice(0, n);
    return this;
  }

  lean() {
    return this;
  }

  then(resolve, reject) {
    resolve(this.data);
  }
}

class SingleQueryBuilder {
  constructor(data) {
    this.data = data;
  }

  lean() {
    return this;
  }

  then(resolve, reject) {
    resolve(this.data);
  }
}

class Booking {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const list = readData();
    if (!this._id) {
      this._id = generateId();
      this.createdAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
      list.push(this);
    } else {
      const idx = list.findIndex(b => b._id === this._id);
      this.updatedAt = new Date().toISOString();
      if (idx !== -1) {
        list[idx] = this;
      } else {
        list.push(this);
      }
    }
    writeData(list);
    return this;
  }

  static find(query) {
    const all = readData();
    const filtered = filterBookings(all, query);
    return new QueryBuilder(filtered);
  }

  static findById(id) {
    const all = readData();
    const found = all.find(b => b._id === id) || null;
    return new SingleQueryBuilder(found);
  }

  static async countDocuments(query = {}) {
    const all = readData();
    const filtered = filterBookings(all, query);
    return filtered.length;
  }

  static async findByIdAndUpdate(id, data, options) {
    const list = readData();
    const idx = list.findIndex(b => b._id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    writeData(list);
    return updated;
  }

  static async findByIdAndDelete(id) {
    const list = readData();
    const idx = list.findIndex(b => b._id === id);
    if (idx === -1) return null;

    const deleted = list[idx];
    list.splice(idx, 1);
    writeData(list);
    return deleted;
  }
}

module.exports = Booking;
