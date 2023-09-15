import { PiperchatServiceConfiguration } from '@/configuration'
import { Microservice } from '@commons/service'
import {
  ServerController,
  ServerControllerExceptions,
} from '@controllers/server/server-controller'
import { ServerControllerImpl } from '@controllers/server/server-controller-impl'
import { Servers } from '@models/server-model'

let controller: ServerController

const piperchatMicroservice: Microservice = new Microservice(
  PiperchatServiceConfiguration
)

beforeAll(async () => {
  await piperchatMicroservice.start()
  controller = new ServerControllerImpl()
})

afterEach(async () => {
  await piperchatMicroservice.clearDatabase()
})

afterAll(async () => {
  await piperchatMicroservice.stop()
})

describe('ServersCrudOps', () => {
  describe('Get', () => {
    it('A new user should not be is any servers', async () => {
      await expect(controller.getServers('user')).rejects.toThrow(
        ServerControllerExceptions.UserNotFound
      )
    })
    // check if getServerById works
    it('A user should be able to get a server by its id', async () => {
      const server = await controller.createServer('server1', 'server1', 'user1')
      const serverById = await controller.getServer(server._id)
      expect(serverById._id.toString).toBe(server._id.toString)
    })

    it('A user should not be able to get a server by its id if it does not exist', async () => {
      await expect(controller.getServer('123')).rejects.toThrow(
        ServerControllerExceptions.ServerNotFound
      )
    })
  })

  describe('Create', () => {
    it('A new user should be able to create multiple server', async () => {
      await controller.createServer('server1', 'server1', 'user1')
      await controller.createServer('server2', 'server2', 'user1')
      const servers = await controller.getServers('user1')
      expect(servers.length).toBe(2)
    })
  })

  describe('Update', () => {
    //A user should not be able to update a server if it's not the owner
    it("A user should not be able to update a server if it's not the owner", async () => {
      const server = await controller.createServer('server1', 'server1', 'user1')
      await expect(controller.updateServer(server._id, 'user2')).rejects.toThrow(
        ServerControllerExceptions.UserNotAuthorized
      )
    })

    //A user should be able to update a server if it's the owner
    it("A user should be able to update a server if it's the owner", async () => {
      const server = await controller.createServer('server1', 'server1', 'user1')
      const updatedServer = await controller.updateServer(
        server._id,
        'user1',
        'server2',
        'server2'
      )
      expect(updatedServer.name).toBe('server2')
      expect(updatedServer.description).toBe('server2')
    })
  })

  describe('Delete', () => {
    // A user should not be able to delete a server if it's not the owner
    it("A user should not be able to delete a server if it's not the owner", async () => {
      const server = await controller.createServer('server1', 'server1', 'user1')
      await expect(controller.deleteServer(server._id, 'user2')).rejects.toThrow(
        ServerControllerExceptions.UserNotAuthorized
      )
    })

    // A user should be able to delete a server if it's the owner
    it("A user should be able to delete a server if it's the owner", async () => {
      const server = await controller.createServer('server1', 'server1', 'user1')
      await controller.createServer('server2', 'server2', 'user1')
      await expect(controller.getServers('user1')).resolves.toHaveLength(2)
      await controller.deleteServer(server._id, 'user1')
      await expect(controller.getServers('user1')).resolves.toHaveLength(1)
    })
  })
})

describe('ServerParticipantsCrudOps', () => {
  describe('Get', () => {
    it("A user should not be able to get the participants of a server if it's not in the server", async () => {
      const server = await createServer('server1', 'server1', 'user1')
      await expect(controller.getServerParticipants(server._id, 'user2')).rejects.toThrow(
        ServerControllerExceptions.UserNotAuthorized
      )
    })

    it("A user should be able to get the participants of a server if it's in the server", async () => {
      const server = await createServer('server1', 'server1', 'user1')
      const participants = await controller.getServerParticipants(server._id, 'user1')
      expect(participants.length).toBe(1)
    })
  })

  describe('Create', () => {
    it("A user should not be able to enter a server if it doesn't exists", async () => {
      await expect(controller.joinServer('user1', 'server1')).rejects.toThrow(
        ServerControllerExceptions.ServerNotFound
      )
    })

    it('A user should be able to enter a server if it exists', async () => {
      const server = await createServer('server1', 'server1', 'user1')
      await controller.joinServer(server._id, 'user2')
      const participants = await controller.getServerParticipants(server._id, 'user2')
      expect(participants.length).toBe(2)
    })
  })

  describe('Remove', () => {
    it("A user should not be able to remove a participant if it's not the owner", async () => {
      const server = await createServer('server1', 'server1', 'user1')
      await controller.joinServer(server._id, 'user2')
      await expect(
        controller.kickUserFromTheServer(server._id, 'user1', 'user2')
      ).rejects.toThrow(ServerControllerExceptions.UserNotAuthorized)
    })

    it("A user should be able to remove a participant if it's the owner", async () => {
      const server = await createServer('server1', 'server1', 'user1')
      await controller.joinServer(server._id, 'user2')
      await controller.kickUserFromTheServer(server._id, 'user2', 'user1')
      const participants = await controller.getServerParticipants(server._id, 'user1')
      expect(participants.length).toBe(1)
    })

    it("A user should not be able to leave a server if it's not in the server", async () => {
      const server = await createServer('server1', 'server1', 'user1')
      await controller.joinServer(server._id, 'user2')
      await expect(controller.leaveServer(server._id, 'user3')).rejects.toThrow(
        ServerControllerExceptions.UserNotAuthorized
      )
    })

    it("A user should be able to leave a server if it's in the server", async () => {
      const server = await createServer('server1', 'server1', 'user1')
      await controller.joinServer(server._id, 'user2')
      await controller.leaveServer(server._id, 'user2')
      const participants = await controller.getServerParticipants(server._id, 'user1')
      expect(participants.length).toBe(1)
    })

    it('A user should not be able to remove the owner of the server', async () => {
      const server = await createServer('server1', 'server1', 'user1')
      await expect(controller.leaveServer(server._id, 'user1')).rejects.toThrow(
        ServerControllerExceptions.OwnerCannotLeave
      )
    })
  })
})

async function createServer(name: string, description: string, owner: string) {
  const server = await Servers.create({
    name,
    description,
    owner,
    participants: [owner],
  })
  return server
}
