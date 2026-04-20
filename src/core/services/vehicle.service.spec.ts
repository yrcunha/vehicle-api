import { EntityManager } from "@mikro-orm/mongodb";
import { Test, TestingModule } from "@nestjs/testing";
import { isUUID } from "class-validator";
import { ConflictError, NotFoundError } from "../domain/entities/error.js";
import { Vehicle } from "../domain/entities/vehicle.js";
import { CreateVehicleDto } from "./dtos/create-vehicle.dto.js";
import { QueryVehicleDto } from "./dtos/query-vehicle.dto.js";
import { UpdateVehicleDto } from "./dtos/update-vehicle.dto.js";
import { VehicleService } from "./vehicle.service.js";

describe(VehicleService.name, () => {
  let service: VehicleService;
  let em: jest.Mocked<EntityManager>;

  const mockVehicle = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    plate: { value: "ABC1234" },
    chassi: { value: "9BWZZZ377VT004251" },
    renavam: { value: "12345678901" },
    model: "Civic",
    make: "Honda",
    year: "2022",
    modelYear: "2023",
    createdAt: new Date(),
    deleted: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: EntityManager,
          useValue: {
            count: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            persist: jest.fn(),
            flush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    em = module.get(EntityManager);
  });

  afterEach(() => jest.clearAllMocks());

  describe(VehicleService.prototype.list.name, () => {
    it("deve retornar veículos paginados com paginação padrão", async () => {
      const query: QueryVehicleDto = { page: 1, limit: 10 };
      const vehicles = [mockVehicle];
      const total = 1;

      em.findAndCount.mockResolvedValue([vehicles, total]);

      const result = await service.list(query);

      expect(em.findAndCount).toHaveBeenCalledWith(
        Vehicle,
        {},
        { limit: 10, offset: 0, orderBy: { createdAt: "DESC" } },
      );
      expect(result).toEqual({
        data: vehicles,
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });
    });

    it("deve aplicar os filtros corretamente", async () => {
      em.findAndCount.mockResolvedValue([[], 0]);
      await service.list({ page: 1, limit: 10, model: "Civic", make: "Honda", year: "2022", modelYear: "2023" });
      expect(em.findAndCount).toHaveBeenCalledWith(
        Vehicle,
        { model: { $ilike: "%Civic%" }, make: { $ilike: "%Honda%" }, year: "2022", modelYear: "2023" },
        expect.any(Object),
      );
    });

    it("deve calcular o offset corretamente para a página 2", async () => {
      const query: QueryVehicleDto = { page: 2, limit: 5 };
      em.findAndCount.mockResolvedValue([[], 0]);
      await service.list(query);
      expect(em.findAndCount).toHaveBeenCalledWith(
        Vehicle,
        {},
        { limit: 5, offset: 5, orderBy: { createdAt: "DESC" } },
      );
    });

    it("deve lidar com resultados vazios", async () => {
      const query: QueryVehicleDto = { page: 1, limit: 10 };
      em.findAndCount.mockResolvedValue([[], 0]);
      const result = await service.list(query);
      expect(result).toEqual({
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
    });
  });

  describe(VehicleService.prototype.create.name, () => {
    const createDto: CreateVehicleDto = {
      plate: "ABC1234",
      chassi: "9BWZZZ377VT004251",
      renavam: "123456790",
      model: "Civic",
      make: "Honda",
      year: "2022",
      modelYear: "2023",
    };

    it("deve criar um veículo com sucesso", async () => {
      em.count.mockResolvedValue(0);
      const result = await service.create(createDto);
      expect(em.count).toHaveBeenCalledWith(Vehicle, {
        $or: [
          { plate: { value: createDto.plate } },
          { renavam: { value: createDto.renavam } },
          { chassi: { value: createDto.chassi } },
        ],
      });
      expect(em.persist).toHaveBeenCalled();
      expect(em.flush).toHaveBeenCalled();
      expect(isUUID(result, "7")).toBe(true);
    });

    it("deve lançar ConflictError quando o veículo já existe", async () => {
      em.count.mockResolvedValue(1);
      await expect(service.create(createDto)).rejects.toThrow(ConflictError);
      expect(em.persist).not.toHaveBeenCalled();
      expect(em.flush).not.toHaveBeenCalled();
    });
  });

  describe(VehicleService.prototype.get.name, () => {
    it("deve retornar o veículo quando encontrado", async () => {
      em.findOne.mockResolvedValue(mockVehicle);
      const result = await service.get(mockVehicle.id);
      expect(em.findOne).toHaveBeenCalledWith(Vehicle, { id: mockVehicle.id });
      expect(result).toBe(mockVehicle);
    });

    it("deve lançar NotFoundError quando o veículo não é encontrado", async () => {
      em.findOne.mockResolvedValue(null);
      await expect(service.get("non-existent-id")).rejects.toThrow(NotFoundError);
    });
  });

  describe(VehicleService.prototype.update.name, () => {
    const updateDto: UpdateVehicleDto = {
      plate: "XYZ7890",
      chassi: "1HGCM82633A123456",
      renavam: "123456790",
      model: "Accord",
      make: "Honda",
      year: "2023",
      modelYear: "2024",
    };

    beforeEach(() => {
      em.findOne.mockResolvedValue({
        ...mockVehicle,
        plate: { value: "OLD1234" },
        chassi: { value: "9BWZZZ377VT004251" },
        renavam: { value: "87654321" },
      } as Vehicle);
    });

    it("deve atualizar todos os campos com sucesso", async () => {
      em.count.mockResolvedValue(0);
      await service.update(mockVehicle.id, updateDto);
      expect(em.findOne).toHaveBeenCalledWith(Vehicle, { id: mockVehicle.id, deleted: false });
      expect(em.count).toHaveBeenCalledTimes(3);
      expect(em.flush).toHaveBeenCalled();
    });

    it("deve lançar NotFoundError quando o veículo não é encontrado", async () => {
      em.findOne.mockResolvedValue(null);
      await expect(service.update("non-existent-id", updateDto)).rejects.toThrow(NotFoundError);
      expect(em.flush).not.toHaveBeenCalled();
    });

    it("deve lançar ConflictError ao atualizar a placa para uma já existente", async () => {
      em.count.mockResolvedValueOnce(1);
      await expect(service.update(mockVehicle.id, { plate: "XYZ9E99" })).rejects.toThrow(ConflictError);
      expect(em.flush).not.toHaveBeenCalled();
    });

    it("deve lançar ConflictError ao atualizar o chassi para um já existente", async () => {
      em.count.mockResolvedValueOnce(1);
      await expect(service.update(mockVehicle.id, { chassi: "1HGCM82633A123456" })).rejects.toThrow(ConflictError);
      expect(em.flush).not.toHaveBeenCalled();
    });

    it("deve lançar ConflictError ao atualizar o renavam para um já existente", async () => {
      em.count.mockResolvedValueOnce(1);
      await expect(service.update(mockVehicle.id, { renavam: "98765432" })).rejects.toThrow(ConflictError);
      expect(em.flush).not.toHaveBeenCalled();
    });

    it("deve lançar ConflictError ao atualizar o renavam para um já existente, informando placa e chassi novos", async () => {
      em.count.mockResolvedValueOnce(0);
      em.count.mockResolvedValueOnce(0);
      em.count.mockResolvedValueOnce(1);
      await expect(
        service.update(mockVehicle.id, { plate: "XYZ9E99", chassi: "1HGCM82633A123456", renavam: "98765432" }),
      ).rejects.toThrow(ConflictError);
      expect(em.flush).not.toHaveBeenCalled();
    });

    it("deve atualizar apenas os campos fornecidos", async () => {
      em.count.mockResolvedValue(0);
      const vehicle = { ...mockVehicle, plate: { value: "OLD1234" } };
      em.findOne.mockResolvedValue(vehicle);
      await service.update(mockVehicle.id, { plate: "NEW1234", model: "Civic Si" });
      expect(vehicle.plate).toEqual({ value: "NEW1234" });
      expect(vehicle.model).toBe("Civic Si");
      expect(em.flush).toHaveBeenCalled();
    });

    it("não deve verificar unicidade para campos não atualizados", async () => {
      em.count.mockResolvedValue(0);
      await service.update(mockVehicle.id, { model: "Accord", year: "2023" });
      expect(em.count).not.toHaveBeenCalled();
      expect(em.flush).toHaveBeenCalled();
    });
  });

  describe(VehicleService.prototype.delete.name, () => {
    it("deve realizar soft delete com sucesso", async () => {
      const vehicle = { ...mockVehicle, deleted: false };
      em.findOne.mockResolvedValue(vehicle);
      await service.delete(mockVehicle.id);
      expect(em.findOne).toHaveBeenCalledWith(Vehicle, { id: mockVehicle.id, deleted: false });
      expect(vehicle.deleted).toBe(true);
      expect(em.flush).toHaveBeenCalled();
    });

    it("deve lançar NotFoundError quando o veículo não é encontrado", async () => {
      em.findOne.mockResolvedValue(null);
      await expect(service.delete("non-existent-id")).rejects.toThrow(NotFoundError);
      expect(em.flush).not.toHaveBeenCalled();
    });

    it("deve lançar NotFoundError quando o veículo já está deletado", async () => {
      em.findOne.mockResolvedValue(null);
      await expect(service.delete(mockVehicle.id)).rejects.toThrow(NotFoundError);
      expect(em.flush).not.toHaveBeenCalled();
    });
  });
});
