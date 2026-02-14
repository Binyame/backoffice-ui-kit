import { Injectable, NotFoundException } from '@nestjs/common';
import { Owner, OwnerRole, PaginationResponse } from '@backoffice-kit/shared';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  private owners: Owner[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      ownershipPercentage: 45,
      role: OwnerRole.CEO,
      createdAt: new Date('2023-01-15').toISOString(),
      updatedAt: new Date('2023-01-15').toISOString(),
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      ownershipPercentage: 30,
      role: OwnerRole.CTO,
      createdAt: new Date('2023-02-20').toISOString(),
      updatedAt: new Date('2023-02-20').toISOString(),
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      ownershipPercentage: 15,
      role: OwnerRole.CFO,
      createdAt: new Date('2023-03-10').toISOString(),
      updatedAt: new Date('2023-03-10').toISOString(),
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@example.com',
      ownershipPercentage: 10,
      role: OwnerRole.Shareholder,
      createdAt: new Date('2023-04-05').toISOString(),
      updatedAt: new Date('2023-04-05').toISOString(),
    },
  ];
  private idCounter = 5;

  findAll(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
  ): PaginationResponse<Owner> {
    let filteredOwners = [...this.owners];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOwners = filteredOwners.filter(
        (owner) =>
          owner.name.toLowerCase().includes(searchLower) ||
          owner.email.toLowerCase().includes(searchLower) ||
          owner.role.toLowerCase().includes(searchLower),
      );
    }

    // Calculate pagination
    const total = filteredOwners.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = filteredOwners.slice(startIndex, endIndex);

    return {
      data,
      page,
      pageSize,
      total,
    };
  }

  findOne(id: string): Owner {
    const owner = this.owners.find((o) => o.id === id);
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return owner;
  }

  create(createOwnerDto: CreateOwnerDto): Owner {
    const now = new Date().toISOString();
    const newOwner: Owner = {
      id: String(this.idCounter++),
      ...createOwnerDto,
      createdAt: now,
      updatedAt: now,
    };
    this.owners.push(newOwner);
    return newOwner;
  }

  update(id: string, updateOwnerDto: UpdateOwnerDto): Owner {
    const ownerIndex = this.owners.findIndex((o) => o.id === id);
    if (ownerIndex === -1) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }

    const updatedOwner: Owner = {
      ...this.owners[ownerIndex],
      ...updateOwnerDto,
      updatedAt: new Date().toISOString(),
    };

    this.owners[ownerIndex] = updatedOwner;
    return updatedOwner;
  }

  remove(id: string): void {
    const ownerIndex = this.owners.findIndex((o) => o.id === id);
    if (ownerIndex === -1) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    this.owners.splice(ownerIndex, 1);
  }
}
